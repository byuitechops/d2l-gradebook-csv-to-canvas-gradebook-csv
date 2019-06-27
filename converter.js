// set assignment names from csv data as new objects' keys
function getAssignmentNames(student) {
    var keynames = Object.keys(student);
    var assigns = keynames.filter(key => {
        // filter out previously read keys
        if (key !== 'OrgDefinedId' && key !== 'Username' &&
            key !== 'Last Name' && key !== 'First Name' &&
            key !== 'Email' && key !== 'End-of-Line Indicator') {
            return true;
        } else {
            return false;
        }
    }).map(key => {
        let name = key.match(/.+(?=\sPoints\sGrade\s\<)/);
        let maxPoints = Number(key.match(/(MaxPoints:\d+)/)[0].slice(10));
        return { name, maxPoints, key };
    });

    return assigns;
}

// // set all csv entries to letter grades or undefined
// function getAssignmentGrade(grade) {
//     if (grade.toUpperCase() === 'PASS') {
//         return '100%';
//     } else if (grade.toUpperCase() === 'FAIL') {
//         return '0%';
//     } else if (grade.toUpperCase() === 'FAILED') {
//         return '0%';
//     } else if (grade.toUpperCase() === 'INCOMPLETE' || grade.toUpperCase() === 'NO RECORD') {
//         return '';
//     } else if (grade.includes('%')) {
//         return grade.replace(' ', '');
//     } else {
//         return grade;
//     }
// }

function convertCanvasStudentObjs(csvData) {
    // set assignment name keys
    var assignments = getAssignmentNames(csvData[0]);
    // for each student set all keys value pairs
    var newCSVData = csvData.map(student => {
        var newStudent = {};
        // remove end of line hash symbol
        delete student['End-of-Line Indicator'];

        newStudent['Student'] = student['First Name'].concat(' ', student['Last Name']);
        newStudent['ID'] = '';
        newStudent['SIS User ID'] = student.OrgDefinedId.slice(1);
        newStudent['SIS Login ID'] = student.Username.slice(1);
        newStudent['Section'] = '';
        assignments.forEach(assignment => {
            // newStudent[assignment.name] = `${(Number(student[assignment.key]) / assignment.maxPoints) * 100} %`;
            if (student[assignment.key] !== "") newStudent[assignment.name] = `${Math.floor((Number(student[assignment.key]) / assignment.maxPoints) * 100)} %`;
            // newStudent[assignment.name] = student[assignment.key];
        });

        return newStudent;
    });

    // add points possible column to csv
    newCSVData.unshift({
        Student: 'Points Possible'
    });

    return newCSVData;
}

function searchEmailList(csvData, emailList) {
    var data = csvData.filter(student => {
        var found = emailList.find(emailObj => {
            return emailObj.Email === student.Email;
        });
        return found !== undefined ? true : false;
    });

    try {
        var newCSVData = convertCanvasStudentObjs(data);
        return newCSVData;
    } catch (e) {
        if (e.message === 'Cannot convert undefined or null to object') {
            console.log('ERROR: CSV does not contain student(s) with email in emailList.csv');
        }
        console.log(e.message);
    }
}

module.exports = function converter(csvData, emailList, useList) {
    var newData;

    if (!useList) {
        newData = convertCanvasStudentObjs(csvData);
    } else {
        newData = searchEmailList(csvData, emailList);
    }

    return newData;
}