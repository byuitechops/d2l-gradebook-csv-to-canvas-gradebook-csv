const spawn = require("child_process").spawn;
const chalk = require("chalk");
const course = process.argv[2];

function runScript(command) {
    var child = spawn("powershell.exe", [`node ${command}`]);
    child.stdout.on("data", data => {
        console.log(chalk.green(`Powershell Data: ${data}`));
    });
    child.stderr.on("data", data => {
        console.log(chalk.red("ERROR: " + data));
    });
    child.on("exit", () => {
        console.log(chalk.green(`${command} finished.`));
    });
    child.stdin.end();
}

function runAllScripts(course) {
    runScript(`.\\create_new_csv\\createNew.js ${course}`);
    runScript(`main.js ${course}`);
    // runScript(`.\\import_grades\\main.js ${course}`);
}

if (course == "early" || course == "elem" || course == "sec") runAllScripts(course);
else if (course == "all") {
    runAllScripts("early");
    runAllScripts("elem");
    runAllScripts("sec");
} else {
    console.log(chalk.red("Please use argv[2]. Valid inputs: early, elem, sec, all"));
}