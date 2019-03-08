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

// set all csv entries to letter grades or undefined
function getAssignmentGrade(grade) {
    if (grade.toUpperCase() === 'PASS') {
        return '100 %';
    } else if (grade.toUpperCase() === 'FAIL') {
        return '0 %';
    } else if (grade.toUpperCase() === 'FAILED') {
        return '0 %';
    } else if (grade.toUpperCase() === 'INCOMPLETE' || grade.toUpperCase() === 'NO RECORD') {
        return '';
    } else if (grade.includes('%')) {
        return grade;
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