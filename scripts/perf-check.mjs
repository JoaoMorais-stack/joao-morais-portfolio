// Mede FPS da cena, escala interna escolhida pela qualidade adaptativa, peso transferido e CLS.
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://127.0.0.1:3210/pt/";
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
for (const vp of [{ w: 1920, h: 1080, dpr: 1 }, { w: 1440, h: 900, dpr: 2 }, { w: 390, h: 844, dpr: 3, mobile: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.dpr, isMobile: !!vp.mobile });
  const page = await ctx.newPage();
  let bytes = 0;
  const byType = {};
  page.on("response", async (r) => {
    try {
      const len = (await r.body()).length;
      bytes += len;
      const t = r.request().resourceType();
      byType[t] = (byType[t] ?? 0) + len;
    } catch {}
  });
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(4500);
  const fps = await page.evaluate(() => new Promise((res) => {
    let n = 0; const t0 = performance.now();
    const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res(n / ((performance.now() - t0) / 1000)); };
    requestAnimationFrame(f);
  }));
  const info = await page.evaluate(() => {
    const c = document.querySelector(".stage-canvas");
    const lcp = performance.getEntriesByType("largest-contentful-paint").at(-1);
    return { canvas: `${c.width}x${c.height}`, css: `${c.clientWidth}x${c.clientHeight}`, cls: window.__cls.toFixed(3) };
  });
  console.log(`${vp.w}x${vp.h}@${vp.dpr}x  fps≈${fps.toFixed(0)}  canvas ${info.canvas} (css ${info.css})  CLS ${info.cls}  transferido ${(bytes / 1024).toFixed(0)} KB`, JSON.stringify(Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)]))));
  await ctx.close();
}
await browser.close();
