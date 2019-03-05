const convertCanvasStudentObjs = require('./converter.js');

var dsv = require('d3-dsv');
const fs = require('fs');
const stripBOM = require('strip-bom');

var d2lCSV = './csv/Early ChildhoodSpecial Education - Major_GradesExport_2019-03-04-16-55.csv';

var csvData = dsv.csvParse(stripBOM(fs.readFileSync(d2lCSV, 'utf8')));

(async function main() {
    try {
        var newCSV = convertCanvasStudentObjs(csvData);
        // console.log(csvData);
    } catch (e) {
        console.log(e);
    }
})();