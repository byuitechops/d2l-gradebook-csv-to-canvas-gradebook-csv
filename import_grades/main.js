const path = require('path');
const fs = require('fs');
const canvas = require('canvas-api-wrapper');
const d3 = require('d3-dsv');
const chalk = require('chalk');
const deepSearch = require('./deepSearch.js');
const crawl = require('./objectCrawler.js');

const inputOpts = {
    early: { courseId: 47544, sectionId: 44962, filePath: 'output/earlychild/Early ChildhoodSpecial Education - Major_GradesImport.csv' },
    elem: { courseId: 47540, sectionId: 44956, filePath: 'output/elementary/Elementary Education - Major_GradesImport.csv' },
    sec: { courseId: 47538, sectionId: 44960, filePath: 'output/secondary/Secondary Education - Major_GradesImport.csv' },
    test: { courseId: 49482, sectionId: 38926, filePath: 'output/test/test.csv' }
};

// Ensures that a student has grades in the Gradebook already
async function getGrades(courseId, studentData) {
    let gradeData = await canvas.get(`/api/v1/courses/${courseId}/users?enrollment_state%5B%5D=active&enrollment_state%5B%5D=invited&enrollment_type%5B%5D=student&enrollment_type%5B%5D=student_view&include%5B%5D=avatar_url&include%5B%5D=group_ids&include%5B%5D=enrollments`);
    // console.dir(gradeData, { depth: null });
    let studentLocation = deepSearch(gradeData, studentData['SIS User ID'])[0].path[0];
    // console.log(studentLocation);
    let hasGrade = crawl(gradeData, [studentLocation]).enrollments[0].grades.current_score !== null;
    console.log(hasGrade);

    return hasGrade;
}

// Imports grades through puppeteer
async function uploadGrade(sectionId, assignmentId, studentId, grade) {
    return new Promise((resolve, reject) => {
        // await canvas.post(`/api/v1/sections/${sectionId}/assignments/${assignmentId}/submissions/update_grades`, {
        // grade_data[<student_id>][posted_grade]
        // grade_data[<student_id>][assignment_id]
        // grade_data: {
        // [`sis_user_id:${studentId}`]: {
        // posted_grade: grade
        // }
        // }
        // });
    });
}

// Handles the importing and verifying of a CSV
async function processAndVerifyGrades(student, courseId, sectionId, canvasAssigns) {
    var assignments = Object.keys(student).filter(key => {
        let found = undefined;
        if (student[key].slice(-1) === "%") {
            found = canvasAssigns.find(canvasAssign => {
                return canvasAssign.name.slice(0, 49) === key.slice(0, 49);
            });

            if (found !== undefined) {
                console.log('FOUND');
                return true;
            } else {
                console.log(`${key} NOT FOUND`);
                return false;
            }
        } else {
            return false;
        }
    });
    console.log(assignments)
    // canvasAssigns.forEach(thing => console.log(thing.name));
    // await uploadGrades(courseId, csvPath);
    // var hasGrades = await getGrades();
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
    csvData.filter(student => student.Student !== 'Points Possible')
        .forEach(student => processAndVerifyGrades(student, inputs.courseId, inputs.sectionId, assigns));
}

main();