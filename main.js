// Location of D2L gradebook csv export you want to convert and output filepath
const inputOpts = {
    early: {
        filePath: './create_new_csv/output/Early ChildhoodSpecial Education - Major_GradesExport_2019-03-11-17-42.csv',
        output: './output/earlychild/Early ChildhoodSpecial Education - Major_GradesImport'
    },
    elem: {
        filePath: './create_new_csv/output/Elementary Education - Major_GradesExport_2019-03-11-17-42.csv',
        output: './output/elementary/Elementary Education - Major_GradesImport'
    },
    sec: {
        filePath: './create_new_csv/output/Secondary Education - Major_GradesExport_2019-03-11-17-42.csv',
        output: './output/secondary/Secondary Education - Major_GradesImport'
    }
};

var d2lCSV = inputOpts[process.argv[2]].filePath;
const output = inputOpts[process.argv[2]].output;

// Location of Email List csv and boolean to use it or not
const useList = false;
var emailCSV = './csv/emailList.csv';

// Libraries
const convertCanvasStudentObjs = require('./converter.js');
var dsv = require('d3-dsv');
const fs = require('fs');
const stripBOM = require('strip-bom');
const chalk = require('chalk');

// read in csv data
var csvData = dsv.csvParse(stripBOM(fs.readFileSync(d2lCSV, 'utf8')));
// read in email list if const useList === true
if (useList) {
    var emailList = dsv.csvParse(stripBOM(fs.readFileSync(emailCSV, 'utf8')));
}

(async function main() {
    try {
        // convert old data to new data
        var newCSVdata = convertCanvasStudentObjs(csvData, emailList, useList);
        fs.writeFileSync(`${output}.csv`, dsv.csvFormat(newCSVdata));
    } catch (e) {
        console.log(chalk.red('ERROR:'), e.message);
    }
})();