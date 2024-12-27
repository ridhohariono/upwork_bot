"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserHandler = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
class BrowserHandler {
    browser;
    constructor() {
        this.browser = this.start();
    }
    start = async () => {
        return await puppeteer_extra_1.default.launch({
            headless: false,
            slowMo: 20,
            args: ["--start-maximized"],
        });
    };
    getNewPage = async (browser) => {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
        await page.setViewport({
            width: 1920,
            height: 900,
            deviceScaleFactor: 1,
        });
        return page;
    };
    restart = async (browser) => {
        browser.close();
        return this.getNewPage(await this.start());
    };
}
exports.BrowserHandler = BrowserHandler;
