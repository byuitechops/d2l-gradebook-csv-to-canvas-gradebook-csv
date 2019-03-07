var d2lCSV = './csv/Secondary Education - Major_GradesExport_2019-03-04-16-55.csv';

const convertCanvasStudentObjs = require('./converter.js');
var dsv = require('d3-dsv');
const fs = require('fs');
const stripBOM = require('strip-bom');

var csvData = dsv.csvParse(stripBOM(fs.readFileSync(d2lCSV, 'utf8')));
const output = './output/'.concat(d2lCSV.slice(5, -27).concat('Import_Canvas.csv'));

(async function main() {
    try {
        var newCSVdata = convertCanvasStudentObjs(csvData);
        // console.log(csvData);
        // console.log(newCSVdata[0]);

        var newCSV = dsv.csvFormat(newCSVdata);
        fs.writeFileSync(output, newCSV);
        // console.log(newCSV);
    } catch (e) {
        console.log(e);
    }
})();