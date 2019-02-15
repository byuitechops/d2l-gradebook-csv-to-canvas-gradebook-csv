const canvas = require('./getStudentsFromCanvas');
var dsv = require('d3-dsv');
const fs = require('fs');
const stripBOM = require('strip-bom');

var d2lCSV = './josh.csv';

var courseId = '80';

var studentData = dsv.csvParse(stripBOM(fs.readFileSync(d2lCSV, 'utf8')));

async function main(){
    try{
        var students = await canvas(courseId);
        console.log(students);
        console.log(studentData);
    } catch(e){
        console.log(e);
    }
}

main();

    