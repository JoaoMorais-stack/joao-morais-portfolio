// Captura as telas dos cinco apps de demonstração rodando localmente e grava
// em _captures/<app>-desktop.png (1440x900 @2x) e <app>-mobile.png (390x844 @3x).
// Depois rode `npm run media` para gerar os WebP publicados.
// Uso: node scripts/capture-projects.mjs [app ...]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "_captures");
await mkdir(out, { recursive: true });

const clickIfPresent = async (page, selector) => {
  const target = page.locator(selector).first();
  if (await target.count()) {
    await target.click();
    await page.waitForTimeout(1500);
  }
};

const APPS = {
  ebinex: { url: "http://127.0.0.1:4173/" },
  clinical: { url: "http://127.0.0.1:8765/", prepare: (p) => clickIfPresent(p, "button:has-text('Run demonstration')") },
  student: {
    url: "http://127.0.0.1:8766/",
    prepare: async (p) => {
      await clickIfPresent(p, "#reset-button");
      await clickIfPresent(p, "button:has-text('Run authorized demo')");
    },
  },
  workforce: { url: "http://127.0.0.1:5000/" },
  shift: { url: "http://127.0.0.1:5100/", prepare: (p) => clickIfPresent(p, "#btnVerEscala") },
};

const selected = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(APPS);
const browser = await chromium.launch({ channel: "chrome" });
for (const name of selected) {
  const app = APPS[name];
  for (const kind of ["desktop", "mobile"]) {
    const mobile = kind === "mobile";
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      deviceScaleFactor: mobile ? 3 : 2,
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(app.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    if (app.prepare) await app.prepare(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: resolve(out, `${name}-${kind}.png`) });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(`${name} ${kind}: overflow ${overflow}, erros JS ${errors.length}`);
    await context.close();
  }
}
await browser.close();
