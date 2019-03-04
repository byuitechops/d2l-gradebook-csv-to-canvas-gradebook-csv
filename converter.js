function getAssignmentName(student) {
    var keynames = Object.keys(student);
    var assigns = keynames.filter(key => {
        if (key !== 'OrgDefinedId' && key !== 'Username' && key !== 'Last Name' && key !== 'First Name' && key !== 'End-of-Line Indicator') {
            return true;
        } else {
            return false;
        }
    }).map(key => {
        return key.slice(0, -14);
    });

    return assigns;
}

module.exports = function convertAll(csvData, students) {

    var newCSVData = csvData.map((student, i) => {
        var newStudent = {};
        newStudent['SIS User ID'] = student.OrgDefinedId.slice(1);
        newStudent['SIS Login ID'] = student.Username.slice(1);
        newStudent.Student = student['First Name'].concat(' ', student['Last Name']);
        newStudent['Root Account'] = 'byui.instructure.com';
        delete student['End-of-Line Indicator'];
        var assignments = getAssignmentName(student);
        console.log(assignments);

        return newStudent;
    });

    return newCSVData;
}