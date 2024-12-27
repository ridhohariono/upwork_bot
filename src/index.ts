import Puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { HTTPResponse, Page } from "puppeteer";
import { UpworkAccount, DataAccount } from "./model/account";
import { generatePassword, randomMouseMove, sleep_for } from "./lib/helper";
import axios from "axios";
import { Mail } from "./lib/mail";
import { Proxy } from "./lib/proxy";
import path from "path";

const UPWORK_URL = "https://www.upwork.com";

/**
 *
 * @param page
 * @param country_account
 * @returns
 */
let select_country = async (page: Page, country_account: string) => {
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
  } catch (error) {}
  return false;
};

/**
 *
 * @param page
 */
let selectLanguage = async (page: Page) => {
  try {
    const languageDropDown = page.locator(".air3-dropdown-toggle");
    await languageDropDown.click();
    await page.waitForSelector("ul#dropdown-menu li");
    const languages = await page.$$("ul#dropdown-menu li");
    await languages[2].click();
  } catch (error) {}
};

/**
 *
 * @param page
 * @param email
 * @param password
 */
let login = async (page: Page, email: string, password: string) => {
  console.log("Login");
  try {
    // await page.goto(`${UPWORK_URL}/ab/account-security/login`, {
    //   waitUntil: "networkidle2",
    // });
    // await page.waitForSelector("input#login_username");
    await page.locator("input#login_username").fill(email);
    await randomMouseMove(page);
    await page.locator("button#login_password_continue").click();
    // await page.waitForSelector("input#login_password");
    await page.waitForSelector("input#login_password", { visible: true });
    await page.locator("input#login_password").fill(password);
    await randomMouseMove(page);
    await page.locator("button#login_control_continue").click();
    await page.waitForNetworkIdle({ timeout: 10000 });
    await page.waitForNavigation({ timeout: 10000 });
  } catch (error) {
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
let stepOne = async (page: Page) => {
  try {
    console.log("Step 1");
    try {
      await page.waitForSelector("button[data-qa='get-started-btn']");
      await page.locator("button[data-qa='get-started-btn']").click();
      await randomMouseMove(page);
      await page.locator("input[value='FREELANCED_BEFORE']").click();
      await page.locator("button[data-test='next-button']").click();
      await page.locator("input[value='MAIN_INCOME']").click();
      await randomMouseMove(page);
      await page.locator("button[data-test='next-button']").click();
      await page.locator("input[value='false']").click();
      await page.locator("button[data-test='next-button']").click();
    } catch (error) {
      console.log("First step error");
    }
    try {
      await randomMouseMove(page);
      await page.locator("button[data-qa='resume-fill-manually-btn']").click();
    } catch (error) {
      console.log("resume-fill-manually-btn step error");
    }
    console.log("Step 1 completed");
    // await sleep_for(2000, 2500);
  } catch (error) {
    console.log(error);
  }
  return true;
};

/**
 *
 * @param page
 * @returns
 */
let stepTwo = async (page: Page) => {
  try {
    // await page.waitForNetworkIdle();
    console.log("Step 2");
    // Categories
    // await page.waitForSelector("div#step-3", { visible: true });
    await page.waitForSelector(`a[data-ev-label='category_activate']`, {
      visible: true,
    });
    console.log("wait complete");
    const categories = await page.$$("a[data-ev-label='category_activate']");

    // await categories[6].click();
    // await page.locator("ul.categories li:nth-child(7)").click();
    await randomMouseMove(page);
    if (categories) {
      await categories[6].click();
      console.log("Step 2 completed");
      await sleep_for(1000, 2000);
      return true;
    }
    console.log("Step 2 completed");
    await sleep_for(1000, 2000);
  } catch (error) {
    console.log(error);
  }
  return stepTwo(page);
};

/**
 *
 * @param page
 * @returns
 */
let stepThreeAndFour = async (page: Page) => {
  try {
    console.log("Step 3-4");
    // Specialities;
    await page.waitForSelector("div.specialties fieldset label");
    const specialities = await page.$$("div.specialties fieldset label");
    const specialitiyIndex = Math.floor(Math.random() * specialities.length);
    await specialities[specialitiyIndex].click();
    await randomMouseMove(page);
    await page.locator("button[data-test='next-button']").click();
    let title = await specialities[specialitiyIndex].evaluate(
      (el) => el.innerText.trim() + " " + "Professional"
    );

    // Skill
    await page.waitForSelector("div.token-container div[role='button']");
    const skills = await page.$$("div.token-container div[role='button']");
    await randomMouseMove(page);
    skills.forEach(async (element) => {
      await element.click();
    });

    await page.locator("button[data-test='next-button']").click();
    await page.waitForSelector("label#title-label");
    await page
      .locator("div[data-qa='title-text'] input.air3-input")
      .fill(title);
    await page.locator("button[data-test='next-button']").click();
    await randomMouseMove(page);
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
      .fill(
        `I'm ${title}. i have working almost 10 years on this field. \n i have been working with small and large projects for my clients in my country`
      );
    await randomMouseMove(page);
    await page.locator("button[data-test='next-button']").click();
    console.log("Step 3-4 completed");
    await sleep_for(1000, 2000);
  } catch (error) {
    console.log(error);
  }
  return true;
};

/**
 *
 * @param page
 * @returns
 */
let stepFive = async (page: Page) => {
  try {
    console.log("Step 5");
    // Hourly Rate
    await page.waitForSelector("input[data-test='currency-input']", {
      visible: true,
    });
    await randomMouseMove(page);
    await page.locator("input[data-test='currency-input']").fill("20");
    await page.locator("button[data-test='next-button']").click();
    console.log("Step 5 completed");
  } catch (error) {
    console.log(error);
  }
  return true;
};

/**
 *
 * @param page
 * @returns
 */
let uploadPhoto = async (page: Page) => {
  await page.waitForNetworkIdle();
  console.log("Upload photo profile");
  try {
    await page.waitForSelector("[data-qa='open-loader']", { visible: true });
    await page.locator("[data-qa='open-loader']").click();
    await randomMouseMove(page);
    await page.waitForSelector("input[id*='image-crop']", { visible: true });
    const inputFile = await page.$("input[id*='image-crop']");
    await inputFile?.uploadFile(
      "D:/Learn/Automation/upwork_automation/src/assets/pp2.jpg"
    );
    // D:\Learn\Automation\upwork_automation\src\assets\images.jpg
    await inputFile?.evaluate((upload) =>
      upload.dispatchEvent(new Event("change", { bubbles: true }))
    );
    await page.waitForNetworkIdle();
    await randomMouseMove(page);
    await page.locator("button.air3-btn-circle").click();
    // await sleep_for(5000, 5000);
    console.log("Wait completed");
    await page.waitForSelector("div.air3-image-crop-avatars img", {
      visible: true,
    });
    await page.locator("button[data-qa='btn-save']").click();
    await page.evaluate(
      `document.querySelectorAll("div[data-qa='portrait-dialog-footer'] button")[1].click()`
    );
    await randomMouseMove(page);
    // await page
    //   .locator(
    //     "xpath//html/body/div[9]/div/div[2]/div/div/div[3]/div/button[2]"
    //   )
    //   .click();
    // await page.waitForNetworkIdle();
    await page.locator("[data-qa='submit-profile-bottom-btn']").click();
    console.log("Upload photo profile completed");
  } catch (error) {
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
let inputAddressInformation = async (
  page: Page,
  account: DataAccount
): Promise<boolean> => {
  await page.waitForNetworkIdle();
  console.log("Address information");
  try {
    await page
      .locator("input[aria-labelledby='date-of-birth-label']")
      .fill(account.dateOfBirth ?? "01/01/1999");
    await randomMouseMove(page);
    if (["United States", "United Kingdom"].includes(account.country ?? "")) {
      await page.locator("input[placeholder='Enter street address']").click();
      await page.type(
        "input[placeholder='Enter street address']",
        account.streetAddress ?? "",
        {
          delay: 500,
        }
      );
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    } else {
      await page
        .locator("input[placeholder='Enter street address']")
        .fill(account.streetAddress ?? "");
    }
    await page.locator("input[placeholder='Enter city']").click();
    await randomMouseMove(page);
    await page.type("input[placeholder='Enter city']", account.city ?? "", {
      delay: 500,
    });
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.locator("input[data-qa='zip']").fill(account.zip ?? "");

    await page.locator("input[type='tel']").fill(account.phone ?? "");
    await randomMouseMove(page);
    await page.locator("[data-test='next-button']").click();
    await page.waitForNetworkIdle();
    // await page.locator("[data-qa='submit-profile-bottom-btn']").click();
    console.log("Address information completed");
  } catch (error) {
    console.log(error);
  }
  return true;
};
/**
 *
 * @param page
 */
let completeRegister = async (page: Page, account: DataAccount) => {
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
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param page
 * @param account
 * @returns
 */
let register = async (page: Page, account: DataAccount) => {
  // account;
  // console.log("Register");
  account.password = generatePassword();
  let username = `${account.firstName}_${
    account.lastName
  }${Date.now()}`.toLowerCase();
  const mail = new Mail(username, account.password);
  account.email = mail.email;
  await mail.createMail();
  try {
    await page.goto(`${UPWORK_URL}/signup/create-account`, {
      waitUntil: "networkidle2",
    });
    await randomMouseMove(page);
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
    await randomMouseMove(page);
    await select_country(page, account.country ?? "United States");
    await page.locator("label#checkbox-terms span").click();
    await page.locator("button#button-submit-form").click();
    await randomMouseMove(page);
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
      await randomMouseMove(page);
      await page.waitForSelector("button[data-qa='get-started-btn']", {
        timeout: 3000,
      });
    } catch {
      await login(page, account.email, account.password);
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

// let setupPage = async (browser: Browser) => {
//   const page = await browser.newPage();
//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
//   );
//   await page.setViewport({
//     width: 1920,
//     height: 900,
//     deviceScaleFactor: 1,
//   });
//   await page.goto("https://httpbin.org/ip");
// };

/**
 *
 * @param page
 */
let startUpwork = async () => {
  Puppeteer.use(StealthPlugin());
  const proxy = new Proxy();
  const proxyData = await proxy.getProxyList("us");
  const proxyURL =
    proxyData[Math.floor(Math.random() * proxyData.length)].proxy;
  console.log(proxyURL);
  try {
    const accounts = new UpworkAccount().getAll();
    for (let account of accounts) {
      const browser = await Puppeteer.launch({
        headless: false,
        slowMo: 40,
        args: ["--start-maximized"],
        // args: ["--start-maximized", `--proxy-server=${proxyURL}`],
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
      );
      await page.setViewport({
        width: 1920,
        height: 900,
        deviceScaleFactor: 1,
      });
      //   await page.goto("https://httpbin.org/ip");
      await register(page, account);

      //   await page.goto(`${UPWORK_URL}/ab/account-security/login`, {
      //     waitUntil: "networkidle2",
      //   });
      //   await page.waitForSelector("input#login_username");
      //   await login(page, account.email ?? "", account.password ?? "");

      await completeRegister(page, account);
      browser.close();
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 */
let main = async () => {
  await startUpwork();
};
main(); //bootstrap
