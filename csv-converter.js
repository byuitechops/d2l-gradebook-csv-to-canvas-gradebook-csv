const canvas = require('./getStudentsFromCanvas');
var dsv = require('d3-dsv');
const fs = require('fs');
const stripBOM = require('strip-bom');

var d2lCSV = process.argv[2];

var courseId = '27206';

async function main(){
    try{
        var students = await canvas(courseId);

        console.log(students);
    } catch(e){
        console.log(e);
    }
}

main();

    