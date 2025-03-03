import fs from "fs";
import { Page } from "puppeteer";

const SESSION_PATH = "./session.json";

// Save session cookies
export const saveSession = async (page: Page) => {
  const cookies = await page.cookies();
  fs.writeFileSync(SESSION_PATH, JSON.stringify(cookies, null, 2));
};

// Load session cookies
export const loadSession = async (page: Page) => {
  if (fs.existsSync(SESSION_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(SESSION_PATH, "utf-8"));
    await page.setCookie(...cookies);
  }
};
