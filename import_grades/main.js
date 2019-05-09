const path = require('path');
const fs = require('fs');
const canvas = require('canvas-api-wrapper');
const d3 = require('d3-dsv');
const chalk = require('chalk');
const deepSearch = require('./deepSearch.js');
const crawl = require('./objectCrawler.js');

const inputOpts = {
    early: { courseId: 47544, dirLocation: 'output/earlychild' },
    elem: { courseId: 47540, dirLocation: 'output/elementary' },
    sec: { courseId: 47538, dirLocation: 'output/secondary' },
    test: { courseId: 49482, dirLocation: 'output/test' }
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
async function uploadGrades(courseId, csvPath) {
    return new Promise((resolve, reject) => {
        await canvas.post(`/api/v1/sections//assignments/:assignment_id/submissions/update_grades`, {
            // grade_data[<student_id>][posted_grade]
            // grade_data[<student_id>][assignment_id]
            grade_data: {
                [`sis_user_id:${studentId}`]: {
                    posted_grade: "100%"
                }
            }
        });
    });
}

// Handles the importing and verifying of a CSV
async function processAndVerifyGrades(courseId, csvPath) {
    let data = d3.csvParse(fs.readFileSync(csvPath, 'utf-8'));
    // console.log(data);
    await uploadGrades(courseId, csvPath);
    var hasGrades = await getGrades(courseId, data[1]);
}

/****************************************************/
function getInput() {
    function sanitizeDirLocation(dirLocation) {
        return path.resolve(dirLocation)
    }
    function limitToCsvs(arrayOfFiles) {
        return arrayOfFiles.filter((file) => path.extname(file) === ".csv");
    }
    directoryLocation = sanitizeDirLocation(inputOpts[process.argv[2]].dirLocation);
    filesInDir = fs.readdirSync(directoryLocation);
    let csvs = limitToCsvs(filesInDir).map((file) => path.resolve(directoryLocation, file))
    let courseId = inputOpts[process.argv[2]].courseId;
    if (courseId === undefined) throw 'Not a Valid Course To Run On | Choose early, elem, sec, or test';
    // console.log(courseId);

    return { csvs, courseId };
}

async function main() {
    let inputs = getInput();
    csvs = inputs.csvs;
    for (let i = 0; i < csvs.length; i++) {
        // console.log(csvs[i]);
        await processAndVerifyGrades(inputs.courseId, csvs[i]);
    }
}

main();