function getAssignmentNames(student) {
    var keynames = Object.keys(student);
    var assigns = keynames.filter(key => {
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

// EDIT THIS TO WORK CORRECTLY
// Currently returns 100 % for all grades
function getAssignmentGrade(grade) {
    if (grade.toUpperCase() === 'PASS') {
        return '100 %';
    } else if (grade.toUpperCase() === 'FAIL') {
        return '0 %';
    } else if (grade.toUpperCase() === 'INCOMPLETE' || grade.toUpperCase() === 'NO RECORD') {
        return '';
    } else {
        return grade;
    }
}

module.exports = function convertCanvasStudentObjs(csvData) {

    var assignments = getAssignmentNames(csvData[0]);
    var newCSVData = csvData.map((student, i) => {
        var newStudent = {};
        delete student['End-of-Line Indicator'];

        newStudent['SIS User ID'] = student.OrgDefinedId.slice(1);
        newStudent['SIS Login ID'] = student.Username.slice(1);
        newStudent['Student'] = student['First Name'].concat(' ', student['Last Name']);
        newStudent['Root Account'] = 'byui.instructure.com';
        assignments.forEach(assignment => {
            // newStudent[assignment.slice(0, -14)] = student[assignment];
            newStudent[assignment.slice(0, -14)] = getAssignmentGrade(student[`${assignment}`]);
        });

        return newStudent;
    });

    newCSVData.unshift({
        Student: 'Points Possible'
    });

    // console.log(newCSVData);

    return newCSVData;
}