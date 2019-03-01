function getPointsPossible(csvStudent) {
    var keynames = Object.keys(csvStudent);
    var regex = /^([\s\S]*?) <[\s\S]*?MaxPoints:(\d+)/;
    var points = keynames.map((keyName) => {
        return regex.exec(keyName);
    });
    console.log(points);
}

module.exports = function convertAll(csvData, students) {
    var newCSV = csvData;
    var pointsPossible = getPointsPossible(csvData[0]);

    return newCSV;
}