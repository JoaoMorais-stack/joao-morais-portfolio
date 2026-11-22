import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Auditoria automática (axe-core, regras WCAG 2.0/2.1/2.2 A e AA).
// Movimento reduzido para medir o estado final das animações de entrada.
const PAGES = ["/pt/", "/en/", "/pt/cases/ebinex/", "/en/cases/student/", "/pt/cases/leadfinder/"];

for (const path of PAGES) {
  for (const vp of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "celular", width: 375, height: 812 },
  ]) {
    test(`axe sem violações em ${path} (${vp.name})`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(path);
      await page.waitForTimeout(1200);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        count: v.nodes.length,
        targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
      await ctx.close();
    });
  }
}
