const dsv = require('d3-dsv'),
    fs = require('fs'),
    path = require('path'),
    stripBOM = require('strip-bom');

/*----- Here is the location of your D2L Input CSV and a Canvas Enrollment Object via process.argv[2] -----*/
var inputOpts = {
    early: {
        d2lCSV: './csv/Early ChildhoodSpecial Education - Major_GradesExport_2019-03-11-17-42.csv',
        enrollments: './create_new_csv/44962-enrollments-20190516_1350.json'
    },
    elem: {
        d2lCSV: './csv/Elementary Education - Major_GradesExport_2019-03-11-17-42.csv',
        enrollments: './create_new_csv/44956-enrollments-20190516_1349.json'
    },
    sec: {
        d2lCSV: './csv/Secondary Education - Major_GradesExport_2019-03-11-17-42.csv',
        enrollments: './create_new_csv/44960-enrollments-20190516_1352.json'
    }
};

var d2lCSV = inputOpts[process.argv[2]].d2lCSV;
var enrollments = inputOpts[process.argv[2]].enrollments;

// output filename
var filename = d2lCSV.split('/').pop().split('.').shift();

/******************************************************************************************** 
 * find the I-Numbers of every student in the enrollment object.
 * NOTE: This could easily be changed to make a call to Canvas in order to get enrollments.
 *       Currently the enrollment object is created by https://github.com/byuitechops/canvas-enroll-students
 ********************************************************************************************/
function findEnrolledStudents(data) {
    var enrolledIds = data.success.map(student => {
        return student.student['SIS Login ID'];
    });

    // console.log(enrolledIds.slice(0, 10)); // for testing just use the first ten.
    // return enrolledIds.slice(0, 10);
    return enrolledIds;
}

// Filter out all students that are not in the 'success' array in the enrollment object
function matchStudents(usernames, csvData) {
    var newData = csvData.filter(student => {
        return usernames.includes(student.Username.slice(1));
    });
    console.log(newData.length, usernames.length); // are we creating a CSV of the same size as our JSON enrollments?
    return newData;
}

(function main() {
    // read in data
    var csvData = dsv.csvParse(stripBOM(fs.readFileSync(path.resolve(d2lCSV), 'utf-8')));
    var enrollmentData = JSON.parse(fs.readFileSync(path.resolve(enrollments), 'utf-8'));

    // find, match, and create new csv
    var usernames = findEnrolledStudents(enrollmentData);
    var newData = matchStudents(usernames, csvData);
    var newCSV = dsv.csvFormat(newData);

    // write to output directory
    fs.writeFileSync(path.resolve(`./create_new_csv/output/${filename}.csv`), newCSV);
})();