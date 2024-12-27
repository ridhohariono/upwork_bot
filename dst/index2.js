"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const account_1 = require("./model/account");
const helper_1 = require("./lib/helper");
const mail_1 = require("./lib/mail");
const UPWORK_URL = "https://www.upwork.com";
/**
 *
 * @param page
 * @param country_account
 * @returns
 */
let select_country = async (page, country_account) => {
    try {
        const countryDropDown = page.locator(".air3-dropdown-toggle");
        await countryDropDown.click();
        await page.waitForSelector("ul#dropdown-menu li");
        await page
            .locator("input[autocomplete='country-name']")
            .fill(country_account);
        const countryList = await page.$$("ul#dropdown-menu li");
        for (let country of countryList) {
            let country_text = await country.evaluate((el) => el.innerText.trim());
            console.log(country_text);
            if (country_account.toLowerCase() == country_text.toLowerCase()) {
                await country.click();
                return country_text;
            }
        }
    }
    catch (error) { }
    return false;
};
/**
 *
 * @param page
 */
let selectLanguage = async (page) => {
    try {
        const languageDropDown = page.locator(".air3-dropdown-toggle");
        await languageDropDown.click();
        await page.waitForSelector("ul#dropdown-menu li");
        const languages = await page.$$("ul#dropdown-menu li");
        await languages[2].click();
    }
    catch (error) { }
};
/**
 *
 * @param page
 * @param email
 * @param password
 */
let login = async (page, email, password) => {
    console.log("Login");
    try {
        // await page.goto(`${UPWORK_URL}/ab/account-security/login`, {
        //   waitUntil: "networkidle2",
        // });
        // await page.waitForSelector("input#login_username");
        await page.locator("input#login_username").fill(email);
        await page.locator("button#login_password_continue").click();
        // await page.waitForSelector("input#login_password");
        await page.waitForSelector("input#login_password", { visible: true });
        await page.locator("input#login_password").fill(password);
        await page.locator("button#login_control_continue").click();
        await page.waitForNetworkIdle({ timeout: 10000 });
        await page.waitForNavigation({ timeout: 10000 });
    }
    catch (error) {
        console.log(error);
    }
    console.log("login completed");
    return true;
};
/**
 *
 * @param page
 * @returns
 */
let stepOne = async (page) => {
    try {
        console.log("Step 1");
        try {
            await page.waitForSelector("button[data-qa='get-started-btn']");
            await page.locator("button[data-qa='get-started-btn']").click();
            await page.locator("input[value='FREELANCED_BEFORE']").click();
            await page.locator("button[data-test='next-button']").click();
            await page.locator("input[value='MAIN_INCOME']").click();
            await page.locator("button[data-test='next-button']").click();
            await page.locator("input[value='false']").click();
            await page.locator("button[data-test='next-button']").click();
        }
        catch (error) {
            console.log("First step error");
        }
        try {
            await page.locator("button[data-qa='resume-fill-manually-btn']").click();
        }
        catch (error) {
            console.log("resume-fill-manually-btn step error");
        }
        console.log("Step 1 completed");
        // await sleep_for(2000, 2500);
    }
    catch (error) {
        console.log(error);
    }
    return true;
};
/**
 *
 * @param page
 * @returns
 */
let stepTwo = async (page) => {
    try {
        await page.waitForNetworkIdle();
        console.log("Step 2");
        // Categories
        await page.waitForSelector("div#step-3", { visible: true });
        await page.waitForSelector("a[data-ev-label='category_activate']", {
            visible: true,
        });
        console.log("wait complete");
        const categories = await page.$$("a[data-ev-label='category_activate']");
        await categories[6].click();
        // await page.locator("ul.categories li:nth-child(7)").click();
        console.log("Step 2 completed");
        await (0, helper_1.sleep_for)(1000, 2000);
    }
    catch (error) {
        console.log(error);
    }
    return true;
};
/**
 *
 * @param page
 * @returns
 */
let stepThreeAndFour = async (page) => {
    try {
        console.log("Step 3-4");
        // Specialities
        await page.waitForSelector("div.specialties fieldset label");
        const specialities = await page.$$("div.specialties fieldset label");
        const specialitiyIndex = Math.floor(Math.random() * specialities.length);
        await specialities[specialitiyIndex].click();
        await page.locator("button[data-test='next-button']").click();
        let title = await specialities[specialitiyIndex].evaluate((el) => el.innerText.trim() + " " + "Professional");
        // Skill
        await page.waitForSelector("div.token-container div[role='button']");
        const skills = await page.$$("div.token-container div[role='button']");
        skills.forEach(async (element) => {
            await element.click();
        });
        await page.locator("button[data-test='next-button']").click();
        await page.waitForSelector("label#title-label");
        await page
            .locator("div[data-qa='title-text'] input.air3-input")
            .fill(title);
        await page.locator("button[data-test='next-button']").click();
        await page.waitForSelector("button[data-test='skip-button']");
        await page.locator("button[data-test='skip-button']").click();
        await page.waitForSelector("button[data-test='skip-button']");
        await page.locator("button[data-test='skip-button']").click();
        await selectLanguage(page);
        await page.locator("button[data-test='next-button']").click();
        // Description
        await page.waitForSelector("textarea");
        await page
            .locator("textarea")
            .fill(`I'm ${title}. i have working almost 10 years on this field. \n i have been working with small and large projects for my clients in my country`);
        await page.locator("button[data-test='next-button']").click();
        console.log("Step 3-4 completed");
        await (0, helper_1.sleep_for)(1000, 2000);
    }
    catch (error) {
        console.log(error);
    }
    return true;
};
/**
 *
 * @param page
 * @returns
 */
let stepFive = async (page) => {
    try {
        console.log("Step 5");
        // Hourly Rate
        await page.waitForSelector("input.air3-input", { visible: true });
        await page.locator("input[data-test='currency-input']").fill("20");
        await page.locator("button[data-test='next-button']").click();
        console.log("Step 5 completed");
    }
    catch (error) {
        console.log(error);
    }
    return true;
};
/**
 *
 * @param page
 * @returns
 */
let uploadPhoto = async (page) => {
    await page.waitForNetworkIdle();
    console.log("Upload photo profile");
    try {
        await page.waitForSelector("[data-qa='open-loader']", { visible: true });
        await page.locator("[data-qa='open-loader']").click();
        await page.waitForSelector("input[id*='image-crop']", { visible: true });
        const inputFile = await page.$("input[id*='image-crop']");
        await inputFile?.uploadFile("D:/Learn/Automation/upwork_automation/src/assets/pp2.jpg");
        // D:\Learn\Automation\upwork_automation\src\assets\images.jpg
        await inputFile?.evaluate((upload) => upload.dispatchEvent(new Event("change", { bubbles: true })));
        await page.waitForNetworkIdle();
        await page.locator("button.air3-btn-circle").click();
        // await sleep_for(5000, 5000);
        console.log("Wait completed");
        await page.waitForSelector("div.air3-image-crop-avatars img", {
            visible: true,
        });
        await page.locator("button[data-qa='btn-save']").click();
        await page.evaluate(`document.querySelectorAll("div[data-qa='portrait-dialog-footer'] button")[1].click()`);
        // await page
        //   .locator(
        //     "xpath//html/body/div[9]/div/div[2]/div/div/div[3]/div/button[2]"
        //   )
        //   .click();
        await page.waitForNetworkIdle();
        await page.locator("[data-qa='submit-profile-bottom-btn']").click();
        console.log("Upload photo profile completed");
    }
    catch (error) {
        console.log(error);
    }
    return true;
};
/**
 *
 * @param page
 * @param account
 * @returns Promise<boolean>
 */
let inputAddressInformation = async (page, account) => {
    await page.waitForNetworkIdle();
    console.log("Address information");
    try {
        await page
            .locator("input[aria-labelledby='date-of-birth-label']")
            .fill(account.dateOfBirth ?? "01/01/1999");
        if (["United States", "United Kingdom"].includes(account.country ?? "")) {
            await page.locator("input[placeholder='Enter street address']").click();
            await page.type("input[placeholder='Enter street address']", account.streetAddress ?? "", {
                delay: 500,
            });
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("Enter");
        }
        else {
            await page
                .locator("input[placeholder='Enter street address']")
                .fill(account.streetAddress ?? "");
        }
        await page.locator("input[placeholder='Enter city']").click();
        await page.type("input[placeholder='Enter city']", account.city ?? "", {
            delay: 500,
        });
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
        await page.locator("input[data-qa='zip']").fill(account.zip ?? "");
        await page.locator("input[type='tel']").fill(account.phone ?? "");
        await page.locator("[data-test='next-button']").click();
        await page.waitForNetworkIdle();
        // await page.locator("[data-qa='submit-profile-bottom-btn']").click();
        console.log("Address information completed");
    }
    catch (error) {
        console.log(error);
    }
    return true;
};
/**
 *
 * @param page
 */
let completeRegister = async (page, account) => {
    try {
        console.log("Completing register");
        await stepOne(page);
        await stepTwo(page);
        await stepThreeAndFour(page);
        await stepFive(page);
        await inputAddressInformation(page, account);
        await uploadPhoto(page);
        console.log("Register completed");
        return true;
    }
    catch (error) {
        console.log(error);
    }
};
/**
 *
 * @param page
 * @param account
 * @returns
 */
let register = async (page, account) => {
    // account;
    // console.log("Register");
    account.password = (0, helper_1.generatePassword)();
    let username = `${account.firstName}_${account.lastName}${Date.now()}`.toLowerCase();
    const mail = new mail_1.Mail(username, account.password);
    account.email = mail.email;
    await mail.createMail();
    try {
        await page.goto(`${UPWORK_URL}/signup/create-account`, {
            waitUntil: "networkidle2",
        });
        await page.locator("div[data-qa='work']").click();
        await page.locator("button[data-qa='btn-apply']").click();
        const firstNameInput = page.locator("#first-name-input");
        const lastNameInput = page.locator("#last-name-input");
        const emailInput = page.locator("#redesigned-input-email");
        const passwordInput = page.locator("#password-input");
        await firstNameInput.fill(account.firstName ?? "");
        await lastNameInput.fill(account.lastName ?? "");
        await emailInput.fill(account.email);
        await passwordInput.fill(account.password);
        await select_country(page, account.country ?? "United States");
        await page.locator("label#checkbox-terms span").click();
        await page.locator("button#button-submit-form").click();
        await page.waitForNetworkIdle();
        await page.waitForNavigation();
        let verificationLink = await mail.getVerificationLink();
        console.log(verificationLink);
        await page.goto(verificationLink, {
            waitUntil: "networkidle2",
        });
        page.waitForNavigation();
        page.waitForNetworkIdle();
        try {
            await page.waitForSelector("button[data-qa='get-started-btn']", {
                timeout: 3000,
            });
        }
        catch {
            await login(page, account.email, account.password);
        }
        return true;
    }
    catch (error) {
        console.log(error);
    }
};
/**
 *
 * @param page
 */
let loadAccount = async (page) => {
    const accounts = new account_1.UpworkAccount().getAll();
    for (let account of accounts) {
        console.log(account.email);
        console.log(account.password);
        await register(page, account);
        // await page.goto(`${UPWORK_URL}/ab/account-security/login`, {
        //   waitUntil: "networkidle2",
        // });
        // await page.waitForSelector("input#login_username");
        // await login(page, account.email ?? "", account.password ?? "");
        await completeRegister(page, account);
    }
};
/**
 *
 * @param page
 */
let startUpwork = async (page) => {
    try {
        await loadAccount(page);
    }
    catch (error) {
        console.log(error);
    }
};
// let setupBrowser = async (proxyData: any, index: number = 0): Promise<Page> => {
//   console.log(index);
//   Puppeteer.use(StealthPlugin());
//   const proxyURL = proxyData[index].proxy;
//   console.log(proxyURL);
//   const browser = await Puppeteer.launch({
//     headless: false,
//     slowMo: 20,
//     args: ["--start-maximized", `--proxy-server=${proxyURL}`],
//   });
//   const page = await browser.newPage();
//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
//   );
//   await page.setViewport({
//     width: 1920,
//     height: 900,
//     deviceScaleFactor: 1,
//   });
//   try {
//     await page.goto("https://httpbin.org/ip", { timeout: 10000 });
//     return page;
//   } catch (error) {
//     browser.close();
//     return await setupBrowser(proxyData, (index += 1));
//   }
// };
let setupBrowser = async () => {
    puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
    const browser = await puppeteer_extra_1.default.launch({
        headless: false,
        slowMo: 20,
        args: ["--start-maximized"],
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
    await page.setViewport({
        width: 1920,
        height: 900,
        deviceScaleFactor: 1,
    });
    return page;
};
/**
 *
 */
let main = async () => {
    //   const proxy = new Proxy();
    //   const proxyData = await proxy.getProxyList("ua");
    const page = await setupBrowser();
    //   await page.goto("https://httpbin.org/ip");
    await startUpwork(page);
};
main(); //bootstrap
