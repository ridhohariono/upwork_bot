import { Browser, Page } from "puppeteer";
import Puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
Puppeteer.use(StealthPlugin());

export class BrowserHandler {
  browser: Promise<Browser>;
  constructor() {
    this.browser = this.start();
  }

  start = async (): Promise<Browser> => {
    return await Puppeteer.launch({
      headless: false,
      slowMo: 20,
      args: ["--start-maximized"],
    });
  };

  getNewPage = async (browser: Browser): Promise<Page> => {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );
    await page.setViewport({
      width: 1920,
      height: 900,
      deviceScaleFactor: 1,
    });
    return page;
  };

  restart = async (browser: Browser): Promise<Page> => {
    browser.close();
    return this.getNewPage(await this.start());
  };
}
