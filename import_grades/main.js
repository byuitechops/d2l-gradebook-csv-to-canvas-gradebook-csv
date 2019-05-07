const path = require('path');
const fs = require('fs');
const canvas = require('canvas-api-wrapper');
const d3 = require('d3-dsv');
const browser = require('puppeteer-canvas-login');
const deepSearch = require('./deepSearch.js');
const crawl = require('./objectCrawler.js');

const canvas_course_id = { early: 47544, elem: 47540, sec: 47538, test: 49482 };
let inputDir = { early: 'output/earlychild', elem: 'output/elementary', sec: 'output/secondary', test: 'output/test' };
let uploadButton = "#gradebook_upload_uploaded_data";

async function getGrades(courseId, studentData) {
    let gradeData = await canvas.get(`/api/v1/courses/${courseId}/users?enrollment_state%5B%5D=active&enrollment_state%5B%5D=invited&enrollment_type%5B%5D=student&enrollment_type%5B%5D=student_view&include%5B%5D=avatar_url&include%5B%5D=group_ids&include%5B%5D=enrollments`);
    // console.dir(hi, { depth: null });
    let studentLocation = deepSearch(gradeData, studentData['SIS User ID'])[0].path[0];
    // console.log(studentLocation);
    let hasNoGrade = crawl(gradeData, [studentLocation]).enrollments[0].grades.current_score === null;
    console.log(hasNoGrade);

    return;
}

async function uploadGrades(csvPath, options) {
    return;
}

async function processAndVerifyGrades(courseId, csvPath) {
    let data = d3.csvParse(fs.readFileSync(csvPath, 'utf-8'));
    // console.log(data);
    await uploadGrades(csvPath);
    await getGrades(courseId, data[1]);
}

/****************************************************/
function getInput(directoryLocation) {
    function sanitizeDirLocation(dirLocation) {
        return path.resolve(dirLocation)
    }
    function limitToCsvs(arrayOfFiles) {
        return arrayOfFiles.filter((file) => path.extname(file) === ".csv");
    }
    directoryLocation = sanitizeDirLocation(directoryLocation);
    filesInDir = fs.readdirSync(directoryLocation);
    let csvs = limitToCsvs(filesInDir).map((file) => path.resolve(directoryLocation, file))
    let courseId = canvas_course_id[process.argv[2]];
    if (courseId === undefined) throw 'Not a Valid Course To Run On | Choose early, elem, sec, or test';
    // console.log(courseId);

    let loginObj = {
        userName: process.env.USERNAMENODE,
        passWord: process.env.PASSWORD,
        launchOptions: {
            defaultViewport: {
                width: 1900,
                height: 1080
            },
            args: ['--start-maximized'],
            headless: false,
            // devtools: true
        }
    };
    return { csvs, loginObj, courseId };
}

async function main() {
    let inputs = getInput(inputDir[process.argv[2]]);
    csvs = inputs.csvs;
    // await browser.login(inputs.loginObj);
    for (let i = 0; i < csvs.length; i++) {
        // console.log(csvs[i]);
        await processAndVerifyGrades(inputs.courseId, csvs[i]);
    }
}

main();