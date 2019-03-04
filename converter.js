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
    if (grade === 'Pass' || 'pass') {
        return '100 %';
    } else if (grade === 'Fail' || 'fail') {
        return '0 %';
    } else {
        return grade;
    }
}

module.exports = function convertAll(csvData, students) {

    var assignments = getAssignmentNames(csvData[0]);
    var newCSVData = csvData.map((student, i) => {
        var newStudent = {};
        delete student['End-of-Line Indicator'];

        newStudent['SIS User ID'] = student.OrgDefinedId.slice(1);
        newStudent['SIS Login ID'] = student.Username.slice(1);
        newStudent['Student'] = student['First Name'].concat(' ', student['Last Name']);
        newStudent['Root Account'] = 'byui.instructure.com';
        assignments.forEach(assignment => {
            newStudent[assignment.slice(0, -14)] = getAssignmentGrade(student[assignment]);
        });
        newStudent['Current Score'] = '';
        newStudent['Unposted Current Score'] = '';
        newStudent['Final Score'] = '';
        newStudent['Unposted Final Score'] = '';
        newStudent['Current Grade'] = '';
        newStudent['Unposted Current Grade'] = '';
        newStudent['Final Grade'] = '';
        newStudent['Unposted Final Grade'] = '';

        return newStudent;
    });

    newCSVData.unshift({
        Student: 'Points Possible'
    });

    console.log(newCSVData);

    return newCSVData;
}