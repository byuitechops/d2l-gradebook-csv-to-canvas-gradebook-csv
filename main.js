const canvas = require('./getStudentsFromCanvas');
const converter = require('./converter.js');

var dsv = require('d3-dsv');
const fs = require('fs');
const stripBOM = require('strip-bom');

var d2lCSV = './FDREL211.csv';

var courseId = '80';

var studentData = dsv.csvParse(stripBOM(fs.readFileSync(d2lCSV, 'utf8')));

(async function main() {
    try {
        var students = await canvas(courseId);
        // console.log(students);
        var newCSV = converter(studentData, students);
        // console.log(studentData);
    } catch (e) {
        console.log(e);
    }
})();