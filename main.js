// Location of D2L gradebook csv export you want to convert
// var d2lCSV = './create_new_csv/output/Early ChildhoodSpecial Education - Major_GradesExport_2019-03-11-17-42.csv';
var d2lCSV = './create_new_csv/output/Elementary Education - Major_GradesExport_2019-03-11-17-42.csv';
// var d2lCSV = './create_new_csv/output/Secondary Education - Major_GradesExport_2019-03-11-17-42.csv';

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

// canvas gradebook csv output file location
// const output = './output/earlychild/Early ChildhoodSpecial Education - Major_GradesImport';
const output = './output/elementary/Elementary Education - Major_GradesImport';
// const output = './output/secondary/Secondary Education - Major_GradesImport';

(async function main() {
    try {
        // convert old data to new data
        var newCSVdata = convertCanvasStudentObjs(csvData, emailList, useList);
        // write file to output location
        // var i = 0;
        // var num = 0;
        // do {
        //     let fileNum = `${num++}`.padStart(2, '0');
        //     fs.writeFileSync(`${output}${fileNum}.csv`, dsv.csvFormat(newCSVdata.slice(i, i + 10)));
        //     console.log(chalk.green(`Wrote data set ${fileNum} to ${output}${fileNum}.csv`));
        //     i += 10;

        // } while (i <= newCSVdata.length);

        fs.writeFileSync(`${output}.csv`, dsv.csvFormat(newCSVdata));

    } catch (e) {
        console.log(chalk.red('ERROR:'), e.message);
    }
})();