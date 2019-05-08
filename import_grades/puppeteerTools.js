// var browser = require('puppeteer-canvas-login');

// // create a new page instance
// async function newPage(course) {
//     var page = await browser.newPage();
//     await page.goto(`https://byui.instructure.com/courses/${course}/gradebook_upload/new`);
//     return page;
// }

// // kill a given page
// async function closePage(page) {
//     await browser.closePage(page);
// }

// module.exports = {
//     login: browser.login,
//     newPage: newPage,
//     closePage: closePage,
//     logout: browser.logout
// };

const puppeteer = require('puppeteer');
const userNameInput = '#pseudonym_session_unique_id';
const passWordInput = '#pseudonym_session_password';
const button = 'button[type=submit]';
var browser;

async function login(inputs) {
    var launchOptionsDefault = {
        defaultViewport: {
            width: 1900,
            height: 1080
        },
        args: ['--start-maximized'],
        headless: false,
        // args: ['--start-maximized', '--debug-devtools'],
        devtools: false
    };
    var launchOptions = Object.assign(launchOptionsDefault, inputs.launchOptions);

    // set the view window for puppeteer
    browser = await puppeteer.launch(launchOptions);

    // There is always a tab made so just use that one
    var pages = await browser.pages();
    var page = pages[0];

    // the domain is defaulted to be 'byui.instructure.com' but can be overwritten
    // by giving 'inputs' a URL key
    var subdomain = inputs.subdomain || 'byui.instructure.com';

    // go to the canvas login and input the login and password
    await page.goto(`https://${subdomain}/login/canvas`, {
        waitUntil: ['load', 'domcontentloaded']
    });

    await page.waitForSelector(userNameInput)
    await page.type(userNameInput, inputs.userName);
    await page.type(passWordInput, inputs.passWord);

    //click the log in button and wait for it to finish logging in before we return
    await Promise.all([page.waitForSelector('.ic-Dashboard-header__title'), page.click(button)]);
    return page;
}

// close the browser, killing the session when done.
async function logout() {
    await browser.close();
}

async function closePage(page) {
    await page.close();
}

async function newPage() {
    return await browser.newPage();
}

module.exports = {
    login: login,
    logout: logout,
    closePage: closePage,
    newPage: newPage
}