// Inspeção visual: captura a página servida em várias larguras e posições de scroll.
// Uso: node scripts/visual-check.mjs [url] [--only=1440,375] [--stops=hero,intro] [--out=screenshots/run]
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith("http")) ?? "http://127.0.0.1:3210/pt/";
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const out = resolve(opt("out", "screenshots/run"));
const only = opt("only", "1920,1440,768,430,375").split(",").map(Number);
const stops = opt("stops", "hero,intro,featured,gallery,about,contact").split(",");
const reduced = args.includes("--reduced");
const noWebgl = args.includes("--nowebgl");

const sizes = {
  1920: { width: 1920, height: 1080, dpr: 1 },
  1440: { width: 1440, height: 900, dpr: 1 },
  768: { width: 768, height: 1024, dpr: 1, mobile: true },
  430: { width: 430, height: 932, dpr: 2, mobile: true },
  375: { width: 375, height: 812, dpr: 2, mobile: true },
};

const where = {
  hero: () => 0,
  hero2: () => Math.round(window.innerHeight * 0.55),
  intro: () => document.querySelector("#intro").getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.35,
  featured: () => {
    const r = document.querySelector(".featured-stage").getBoundingClientRect();
    return r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
  },
  meta: () => document.querySelector(".featured-meta").getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3,
  gallery: () => document.querySelector(".gallery").getBoundingClientRect().top + window.scrollY,
  security: () => document.querySelector("#seguranca").getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.15,
  security2: () => document.querySelector(".security-grid").getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2,
  about: () => document.querySelector("#sobre").getBoundingClientRect().top + window.scrollY,
  contact: () => document.querySelector("#contato").getBoundingClientRect().top + window.scrollY,
};

await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const report = [];
for (const w of only) {
  const s = sizes[w];
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.dpr,
    isMobile: !!s.mobile,
    hasTouch: !!s.mobile,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => ["error", "warning"].includes(m.type()) && errors.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  const t0 = Date.now();
  await page.goto(url + (noWebgl ? "?nowebgl" : ""), { waitUntil: "load" });
  await page.waitForTimeout(3200);
  const gl = await page.evaluate(() => {
    const c = document.createElement("canvas").getContext("webgl2");
    const ext = c?.getExtension("WEBGL_debug_renderer_info");
    return {
      renderer: ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "n/a",
      mode: document.querySelector(".stage")?.getAttribute("data-mode"),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  for (const stop of stops) {
    const y = await page.evaluate(`(${where[stop].toString()})()`);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(1400);
    const file = `${w}-${stop}${reduced ? "-reduced" : ""}${noWebgl ? "-nowebgl" : ""}.png`;
    await page.screenshot({ path: resolve(out, file) });
  }
  report.push({ width: w, loadMs: Date.now() - t0, ...gl, errors });
  await ctx.close();
}
await browser.close();
await writeFile(resolve(out, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
