const path = require('path');
const fs = require('fs');
const canvas = require('canvas-api-wrapper');
const d3 = require('d3-dsv');
const chalk = require('chalk');
const pmap = require('p-map');

const inputOpts = {
    early: { courseId: 47544, sectionId: 44962, filePath: 'output/earlychild/Early ChildhoodSpecial Education - Major_GradesImport.csv' },
    elem: { courseId: 47540, sectionId: 44956, filePath: 'output/elementary/Elementary Education - Major_GradesImport.csv' },
    sec: { courseId: 47538, sectionId: 44960, filePath: 'output/secondary/Secondary Education - Major_GradesImport.csv' },
    test: { courseId: 49482, sectionId: 38926, filePath: 'output/test/test.csv' }
};

// Imports grades through puppeteer
async function uploadGrade(input, i) {
    debugger;
    await canvas.post(`/api/v1/sections/${input.sectionId}/assignments/${input.assignmentId}/submissions/update_grades?grade_data[sis_user_id:${input.sis_user_id}][posted_grade]="${input.grade}"`);
    debugger;
}

// Ensures that a student has grades in the Gradebook already
async function getCanvasGrades(input, i) {
    let submissionData = await canvas.get(`/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions?include[]=user`);
    let studentSubmission = submissionData.find(submission => submission.user.sis_user_id === input.sis_user_id);
    let hasGrade = studentSubmission.workflow_state === "graded" ? true : false;
    input.hasGrade = hasGrade;

    return input;
}

// Handles the importing and verifying of a CSV
async function processAndVerifyGrades(input, i) {
    console.log(chalk.green(`${i}/${input.num} | ${input.student['SIS User ID']} | ${(i / input.num) * 100}%`));

    let student = input.student;
    let courseId = input.courseId;
    let sectionId = input.sectionId;
    let canvasAssigns = input.canvasAssigns;

    var assignments = Object.keys(student).reduce((accum, key) => {
        let found = undefined;
        // find all graded assignments
        if (student[key].slice(-1) === "%") {
            // if assignment name matches a canvas assignment return
            found = canvasAssigns.find(canvasAssign => {
                return canvasAssign.name.slice(0, 49) === key.slice(0, 49);
            });

            if (found !== undefined) {
                // console.log('FOUND');
                accum.push({
                    courseId: courseId,
                    sectionId: sectionId,
                    assignmentId: found.id,
                    sis_user_id: student['SIS User ID'],
                    grade: student[key]
                });
            } else {
                // if name doesn't match log message and skip inclusion
                console.log(`${key} NOT FOUND. PLEASE CHANGE CSV.`);
            }
        }
        return accum;
    }, []);

    // If there are no grades found in assignments go ahead and return out
    if (assignments.length === 0) return;
    // get each canvas submission to ensure the import is needed
    var canvasGrades = await pmap(assignments, getCanvasGrades, { concurrency: 10 });
    // filter off all the assignments that have a grade in Canvas
    var toImport = canvasGrades.filter(assignment => assignment.hasGrade === false);
    // if there are no grades to import go ahead and return out
    if (toImport.length === 0) return;
    await pmap(toImport, uploadGrade, { concurrency: 1 });

    return;
}

/****************************************************/
function getInput() {
    function sanitizeDirLocation(filePath) {
        return path.resolve(filePath)
    }
    fileLocation = sanitizeDirLocation(inputOpts[process.argv[2]].filePath);
    let csv = fs.readFileSync(fileLocation, 'utf-8');
    let courseId = inputOpts[process.argv[2]].courseId;
    let sectionId = inputOpts[process.argv[2]].sectionId;
    if (courseId === undefined) throw 'Not a Valid Course To Run On | Choose early, elem, sec, or test';
    // console.log(courseId);

    return { csv, courseId, sectionId };
}

async function main() {
    let inputs = getInput();
    csvData = d3.csvParse(inputs.csv);
    // console.log(csvData[0]);
    // for (let i = 0; i < csv.length; i++) {
    // console.log(csvs[i]);
    // await processAndVerifyGrades(inputs.courseId, csvs[i]);
    // }
    var assigns = await canvas.get(`/api/v1/courses/${inputs.courseId}/assignments/`);
    // console.log(assigns)
    var gradeData = csvData.filter(student => student.Student !== 'Points Possible')
        .map(student => {
            return {
                student,
                courseId: inputs.courseId,
                sectionId: inputs.sectionId,
                canvasAssigns: assigns,
                num: csvData.length
            };
        });
    await pmap(gradeData, processAndVerifyGrades, { concurrency: 1 });
}

main();