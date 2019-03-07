// set assignment names from csv data as new objects' keys
function getAssignmentNames(student) {
    var keynames = Object.keys(student);
    var assigns = keynames.filter(key => {
        // filter out previously read keys
        if (key !== 'OrgDefinedId' && key !== 'Username' &&
            key !== 'Last Name' && key !== 'First Name' &&
            key !== 'End-of-Line Indicator' && key !== 'Calculated Final Grade Scheme Symbol' &&
            key !== 'Adjusted Final Grade Scheme Symbol') {
            return true;
        } else {
            return false;
        }
    }).map(key => {
        return key;
    });

    return assigns;
}

// set percentages to letter grades
function letterGradeOf(grade) {
    var num = Number(grade.slice(0, -2));
    var string = '';

    if (num >= 94) {
        string = 'A';
    } else if (num < 94 && num >= 90) {
        string = 'A-';
    } else if (num < 90 && num >= 87) {
        string = 'B+';
    } else if (num < 87 && num >= 84) {
        string = 'B';
    } else if (num < 84 && num >= 80) {
        string = 'B-';
    } else if (num < 80 && num >= 77) {
        string = 'C+';
    } else if (num < 77 && num >= 74) {
        string = 'C';
    } else if (num < 74 && num >= 70) {
        string = 'C-';
    } else if (num < 70 && num >= 67) {
        string = 'D+';
    } else if (num < 67 && num >= 64) {
        string = 'D';
    } else if (num < 64 && num >= 61) {
        string = 'D-';
    } else {
        string = 'F';
    }

    return string;
}

// set all csv entries to letter grades or undefined
function getAssignmentGrade(grade) {
    if (grade.toUpperCase() === 'PASS') {
        return 'A';
    } else if (grade.toUpperCase() === 'FAIL') {
        return 'F';
    } else if (grade.toUpperCase() === 'FAILED') {
        return 'F';
    } else if (grade.toUpperCase() === 'INCOMPLETE' || grade.toUpperCase() === 'NO RECORD') {
        return '';
    } else if (grade.includes('%')) {
        return letterGradeOf(grade);
    } else {
        return grade;
    }
}

module.exports = function convertCanvasStudentObjs(csvData) {

    // set assignment name keys
    var assignments = getAssignmentNames(csvData[0]);
    // for each student set all keys value pairs
    var newCSVData = csvData.map((student, i) => {
        var newStudent = {};
        // remove end of line hash symbol
        delete student['End-of-Line Indicator'];

        newStudent['Student'] = student['First Name'].concat(' ', student['Last Name']);
        newStudent['ID'] = '';
        newStudent['SIS User ID'] = student.OrgDefinedId.slice(1);
        newStudent['SIS Login ID'] = student.Username.slice(1);
        newStudent['Root Account'] = 'byui.instructure.com';
        assignments.forEach(assignment => {
            newStudent[assignment.slice(0, -14)] = getAssignmentGrade(student[`${assignment}`]);
        });

        return newStudent;
    });

    // add points possible column to csv
    newCSVData.unshift({
        Student: 'Points Possible'
    });

    return newCSVData;
}