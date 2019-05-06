const canvas = require('canvas-api-wrapper');
const puppeteer = require('puppeteer');
let uploadButton = "#gradebook_upload_uploaded_data";

async function getGrades(course) {
    let hi = await canvas.get(`/api/v1/courses/${course}/users?enrollment_state%5B%5D=active&enrollment_state%5B%5D=invited&enrollment_type%5B%5D=student&enrollment_type%5B%5D=student_view&include%5B%5D=avatar_url&include%5B%5D=group_ids&include%5B%5D=enrollments&per_page=100`);
    console.dir(hi, { depth: null });
}

function uploadGrades() {

}

function publishGrades() {

}

/****************************************************/
function input() {

}

function main() {

}