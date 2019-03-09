// Location of D2L gradebook csv export you want to convert
var d2lCSV = './csv/Elementary Education - Major_GradesExport_2019-03-04-16-56.csv';

const convertCanvasStudentObjs = require('./converter.js');
var dsv = require('d3-dsv');
const fs = require('fs');
const stripBOM = require('strip-bom');

// read in csv data
var csvData = dsv.csvParse(stripBOM(fs.readFileSync(d2lCSV, 'utf8')));
// canvas gradebook csv output file location
const output = './output/'.concat(d2lCSV.slice(5, -27).concat('Import_Canvas.csv'));

(async function main() {
    try {
        // convert old data to new data
        var newCSVdata = convertCanvasStudentObjs(csvData);
        // convert new data to csv file
        var newCSV = dsv.csvFormat(newCSVdata);
        // write file to output location
        fs.writeFileSync(output, newCSV);
    } catch (e) {
        console.log(e);
    }
})();