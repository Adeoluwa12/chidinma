import puppeteer from "puppeteer";
import { saveSession, loadSession } from "./sessionHandler";
import { sendNotification } from "./notifier";
import { MemberModel } from "../models/member";
import { LogModel } from "../models/log";

const AVAILITY_URL = "https://apps.availity.com/web/onboarding/availity-fr-ui/?p:lm=1740625149#/login";
const USERNAME = process.env.AV_USER_ID!;
const PASSWORD = process.env.AV_PASSWORD!;

export const monitorAvaility = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(AVAILITY_URL);

  await loadSession(page);

  const loginField = await page.$('input[name="userId"]');
  if (loginField) {
    await page.type('input[name="userId"]', USERNAME);
    await page.type('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await saveSession(page);
  }

  await page.waitForSelector("a[title='Care Center']");
  await page.click("a[title='Care Center']");
  await page.waitForNavigation();

  await page.select("#organizationDropdown", "Harmony Health LLC");
  const taxIdField = await page.$("#taxId");
  if (taxIdField) await page.type("#taxId", "922753606");
  await page.select("#providerDropdown", "Harmony Health");
  await page.click("#nextButton");
  await page.waitForNavigation();

  await page.click("a[title='Referrals']");
  await page.waitForSelector(".member-list");

  const members = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".member-item")).map(el => el.textContent?.trim());
  });

  const firstMember = members[0] || "No members found";
  console.log("👤 First Member:", firstMember);
  await sendNotification(`First member detected: ${firstMember}`);

  await browser.close();
};
