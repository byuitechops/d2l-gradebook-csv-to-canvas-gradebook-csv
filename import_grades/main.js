const path = require('path');
const fs = require('fs');
const canvas = require('canvas-api-wrapper');
const d3 = require('d3-dsv');
const chalk = require('chalk');
const pmap = require('p-map');

// input options objects that have all the necessary info to run correctly
const inputOpts = {
    early: { courseId: 47544, sectionId: 44962, filePath: 'output/earlychild/Early ChildhoodSpecial Education - Major_GradesImport.csv' },
    elem: { courseId: 47540, sectionId: 44956, filePath: 'output/elementary/Elementary Education - Major_GradesImport.csv' },
    sec: { courseId: 47538, sectionId: 44960, filePath: 'output/secondary/Secondary Education - Major_GradesImport.csv' },
    test: { courseId: 49482, sectionId: 38926, filePath: 'output/test/test.csv' }
};

/****************************** FUNCTIONS ********************************/

// Imports a single grade for a single assignment for a single student
async function uploadGrade(input, i) {
    try {
        await canvas.post(`/api/v1/sections/${input.sectionId}/assignments/${input.assignmentId}/submissions/update_grades`, {
            grade_data: { [`sis_user_id:${input.sis_user_id}`]: { posted_grade: `${input.grade}` } }
        });
    } catch (err) {
        console.log(chalk.red(`Error importing grade for assign:${input.assignmentId} for student:${input.sis_user_id}`));
    }
}

// Checks whether a student has grades in the Gradebook already for a single assignment
async function getCanvasGrades(input, i) {
    let hasGrade = false;
    try {
        // get all the submissions for a given assignment
        let submissionData = await canvas.get(`/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions?include[]=user`);
        // search for the given student's submission(s)
        let studentSubmission = submissionData.find(submission => submission.user.sis_user_id === input.sis_user_id);

        // if equal to graded then we can skip uploading this assignment's grade,
        // otherwise it is probably equal to "unsubmitted" and we can call uploadGrade()
        hasGrade = studentSubmission.workflow_state === "graded" ? true : false;
        // set the [hasGrade] key equal to true or false and return the input object
    } catch (err) {
        console.log(chalk.red(`Error getting grades for assign:${input.assignmentId} for student:${input.sis_user_id}`));
    }
    input.hasGrade = hasGrade;
    return input;
}

// Process a single student's grades in the CSV and in Canvas and import as necessary
async function processAndVerifyGrades(input, i) {
    // log our progress
    console.log(chalk.green(`${i + 1}/${input.num} | ${input.student['SIS User ID']} | ${Math.floor(((i + 1) / input.num) * 100)}%`));

    // loop through all assignments
    var assignments = Object.keys(input.student).reduce((accum, key) => {
        let found = undefined;
        // find all graded assignments for the student
        if (input.student[key].slice(-1) === "%") {
            // if assignment name matches a canvas assignment filter it in
            found = input.canvasAssigns.find(canvasAssign => {
                return canvasAssign.name.slice(0, 49) === key.slice(0, 49);
            });

            // if we found something then create another input object
            if (found !== undefined) {
                accum.push({
                    courseId: input.courseId,
                    sectionId: input.sectionId,
                    assignmentId: found.id,
                    sis_user_id: input.student['SIS User ID'],
                    grade: input.student[key]
                });
            } else {
                // if name doesn't match log message and skip inclusion
                console.log(`${key} NOT FOUND. PLEASE CHANGE CSV.`);
            }
        }
        return accum;
    }, []);

    // If there are no grades found for this student go ahead and return out
    if (assignments.length === 0) return 0;
    // get each canvas submission to ensure the import is needed
    var canvasGrades = await pmap(assignments, getCanvasGrades, { concurrency: 1 });
    // filter off all the assignments that have a grade in Canvas
    var toImport = canvasGrades.filter(assignment => assignment.hasGrade === false);
    // if there are no grades to import go ahead and return out
    if (toImport.length === 0) return 0;
    // import!
    await pmap(toImport, uploadGrade, { concurrency: 1 });

    return toImport.length;
}

/************************* MAIN ***************************/
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
    csvData = d3.csvParse(inputs.csv)
        .slice(176);
    // find all assignments in Canvas for the given course
    var assigns = await canvas.get(`/api/v1/courses/${inputs.courseId}/assignments/`);
    // get all students and create input objects
    var gradeData = csvData.filter(student => student.Student !== 'Points Possible')
        .map(student => {
            return {
                student,
                courseId: inputs.courseId,
                sectionId: inputs.sectionId,
                canvasAssigns: assigns,
                num: csvData.length - 1
            };
        });
    var calls = await pmap(gradeData, processAndVerifyGrades, { concurrency: 1 });
    // when done print how many grades were imported or tried to import
    calls = calls.reduce((accum, call) => accum + call, 0);
    console.log(chalk.yellow(`${calls} grade(s) imported.`));
}

main();