// Grava um passeio pela página (vídeo real do navegador) em celular e desktop.
// Uso: node scripts/record-tour.mjs [url]   → screenshots/videos/*.webm
import { chromium } from "@playwright/test";
import { mkdir, rename } from "node:fs/promises";
import { resolve } from "node:path";

const url = process.argv.find((a) => a.startsWith("http")) ?? "http://127.0.0.1:3210/pt/";
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const out = resolve(import.meta.dirname, "..", "screenshots", "videos");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
});

const glide = async (page, to, pxPerFrame) => {
  // rolagem contínua, como um dedo/roda do mouse
  for (;;) {
    const y = await page.evaluate(() => window.scrollY);
    if (y >= to - 2) break;
    await page.evaluate((d) => window.scrollBy(0, d), Math.min(pxPerFrame, to - y));
    await page.waitForTimeout(16);
  }
};
const topOf = (page, sel, off = 0) =>
  page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + window.scrollY + o * window.innerHeight, [sel, off]);

for (const vp of [
  { name: "celular", width: 390, height: 844, dpr: 3, mobile: true, speed: 7, video: { width: 390, height: 844 } },
  { name: "desktop", width: 1440, height: 900, dpr: 1, mobile: false, speed: 9, video: { width: 1440, height: 900 } },
].filter((v) => !only || v.name === only)) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    recordVideo: { dir: out, size: vp.video },
  });
  const page = await ctx.newPage();
  await page.goto(url + "?fixedq", { waitUntil: "load" });
  if (!vp.mobile) {
    await page.mouse.move(700, 450);
    await page.waitForTimeout(2500);
    await page.mouse.move(1100, 300, { steps: 60 });
    await page.mouse.move(400, 600, { steps: 80 });
  } else {
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(800);
  await glide(page, await topOf(page, ".featured-stage", -0.15), vp.speed);
  await page.waitForTimeout(1500);
  await glide(page, await topOf(page, ".gallery"), vp.speed);
  await page.waitForTimeout(800);
  const panels = page.locator(".panel-trigger");
  const n = await panels.count();
  for (let i = 1; i < n; i++) {
    if (vp.mobile) {
      await panels.nth(i).tap();
      await page.waitForTimeout(400);
      await glide(page, await topOf(page, `.panel:nth-child(${i + 1})`, -0.12), vp.speed);
      await page.waitForTimeout(1200);
    } else {
      const box = await panels.nth(i).boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
      await page.waitForTimeout(1300);
    }
  }
  await glide(page, await topOf(page, "#sobre"), vp.speed);
  await page.waitForTimeout(1500);
  await glide(page, await topOf(page, "#contato"), vp.speed);
  await page.waitForTimeout(3000);
  const video = page.video();
  await ctx.close();
  await rename(await video.path(), resolve(out, `tour-${vp.name}.webm`));
  console.log("ok", vp.name);
}
await browser.close();
