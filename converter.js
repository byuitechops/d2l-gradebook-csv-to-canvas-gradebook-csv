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

function letterGradeOf(grade) {
    var num = Number(grade.slice(0, -2));
    var string = '';
    switch (num) {
        case num >= 94:
            string = 'A';
            break;
        case num < 94 && num >= 90:
            string = 'A-';
            break;
        case num < 90 && num >= 87:
            string = 'B+';
            break;
        case num < 87 && num >= 84:
            string = 'B';
            break;
        case num < 84 && num >= 80:
            string = 'B-';
            break;
        case num < 80 && num >= 77:
            string = 'C+';
            break;
        case num < 77 && num >= 74:
            string = 'C';
            break;
        case num < 74 && num >= 70:
            string = 'C-';
            break;
        case num < 70 && num >= 67:
            string = 'D+';
            break;
        case num < 67 && num >= 64:
            string = 'D';
            break;
        case num < 64 && num >= 61:
            string = 'D-';
            break;
        case num < 61:
            string = 'F';
            break;
    }
    return string;
}

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

    var assignments = getAssignmentNames(csvData[0]);
    var newCSVData = csvData.map((student, i) => {
        var newStudent = {};
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

    newCSVData.unshift({
        Student: 'Points Possible'
    });

    // console.log(newCSVData);

    return newCSVData;
}