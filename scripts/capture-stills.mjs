// Gera as imagens estáticas da cena (fallback sem WebGL e Open Graph) a partir
// do próprio renderizador, em modo de captura. Requer o build servido em 127.0.0.1:3210.
import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import sharp from "sharp";

const base = process.argv[2] ?? "http://127.0.0.1:3210/pt/";
const caps = resolve(import.meta.dirname, "..", "_captures");
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const shots = [
  { file: "scene-still.png", w: 1920, h: 1080, dpr: 1, q: "?capture" },
  { file: "scene-still-mobile.png", w: 430, h: 932, dpr: 2, q: "?capture", mobile: true },
  { file: "og.png", w: 1200, h: 630, dpr: 1, q: "" },
];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.dpr, isMobile: !!s.mobile });
  const page = await ctx.newPage();
  await page.goto(base + s.q, { waitUntil: "load" });
  await page.waitForTimeout(5000);
  await page.mouse.move(s.w / 2, s.h / 2);
  await page.screenshot({ path: resolve(caps, s.file) });
  await ctx.close();
  console.log("ok", s.file);
}
await browser.close();
await sharp(resolve(caps, "og.png")).jpeg({ quality: 84, mozjpeg: true }).toFile(resolve(import.meta.dirname, "..", "public/media/og-scene.jpg"));
