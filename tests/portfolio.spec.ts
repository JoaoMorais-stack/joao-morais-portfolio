import { expect, test, type Page } from "@playwright/test";

const collectErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
};

test.describe("conteúdo e SEO", () => {
  for (const lang of ["pt", "en"] as const) {
    test(`/${lang}/ tem idioma, título, metadados e nome acessível`, async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(`/${lang}/`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang === "pt" ? "pt-BR" : "en");
      await expect(page.getByRole("heading", { level: 1, name: "João Morais" })).toBeVisible();
      await expect(page).toHaveTitle(/João Morais/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{60,}/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-singularity\.jpg$/);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
      await page.waitForTimeout(1500);
      expect(errors).toEqual([]);
    });
  }

  test("a raiz redireciona para um idioma", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/\/(pt|en)\/$/);
  });

  test("toda imagem de conteúdo tem texto alternativo e links externos são seguros", async ({ page }) => {
    await page.goto("/pt/");
    const missingAlt = await page.locator("main img:not([alt]), main img[alt='']").count();
    expect(missingAlt).toBe(0);
    const unsafe = await page.locator('a[target="_blank"]:not([rel*="noopener"])').count();
    expect(unsafe).toBe(0);
  });

  test("os links de repositório apontam para repositórios públicos existentes", async ({ page, request }) => {
    await page.goto("/pt/");
    const hrefs = await page.locator('a[href^="https://github.com/JoaoMorais-stack/"]').evaluateAll((as) =>
      Array.from(new Set(as.map((a) => (a as HTMLAnchorElement).href))),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(5);
    for (const href of hrefs) {
      const res = await request.head(href);
      expect(res.status(), href).toBeLessThan(400);
    }
  });
});

test.describe("cena WebGL e alternativas", () => {
  test("a cena entra em modo ao vivo quando há WebGL2", async ({ page }) => {
    await page.goto("/pt/");
    await expect(page.locator(".stage")).toHaveAttribute("data-mode", "live", { timeout: 15_000 });
    await expect(page.locator(".stage-canvas")).toHaveClass(/is-live/);
  });

  test("a renderização pausa quando a cena sai de vista e volta no contato", async ({ page }) => {
    await page.goto("/pt/");
    await expect(page.locator(".stage")).toHaveAttribute("data-mode", "live", { timeout: 15_000 });
    await page.locator("#sobre").scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const r = document.querySelector("#sobre")!.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY + 40);
    });
    await expect(page.locator(".stage-canvas")).toHaveAttribute("data-active", "false");
    await page.locator("#contato").scrollIntoViewIfNeeded();
    await expect(page.locator(".stage-canvas")).toHaveAttribute("data-active", "true");
  });

  test("sem WebGL a imagem estática permanece", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/pt/?nowebgl");
    await expect(page.locator(".stage")).toHaveAttribute("data-mode", "static");
    await expect(page.locator(".stage-poster")).toBeVisible();
    const loaded = await page.locator(".stage-poster").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(loaded).toBe(true);
    expect(errors).toEqual([]);
  });

  test("com movimento reduzido o texto da introdução fica legível", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/pt/");
    await page.locator("#intro").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const minOpacity = await page.locator("[data-reveal-words] .word").evaluateAll((els) =>
      Math.min(...els.map((e) => Number(getComputedStyle(e).opacity))),
    );
    expect(minOpacity).toBe(1);
    await ctx.close();
  });
});

test.describe("layout responsivo", () => {
  for (const [w, h] of [
    [375, 812],
    [430, 932],
    [768, 1024],
    [1440, 900],
    [1920, 1080],
  ]) {
    test(`sem rolagem horizontal em ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/pt/");
      await page.waitForTimeout(600);
      for (const y of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f), y);
        await page.waitForTimeout(150);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("interação", () => {
  test("a galeria abre projetos pelo teclado", async ({ page }) => {
    await page.goto("/pt/");
    const triggers = page.locator(".panel-trigger");
    await triggers.first().focus();
    await expect(triggers.first()).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("ArrowRight");
    await expect(triggers.nth(1)).toBeFocused();
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(triggers.first()).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("End");
    await expect(triggers.last()).toHaveAttribute("aria-expanded", "true");
  });

  test("o menu mobile abre, navega e fecha com Esc", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/pt/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Fechar" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#site-nav").getByRole("link", { name: "Projetos", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("o link de pular conteúdo aparece no primeiro Tab", async ({ page }) => {
    await page.goto("/pt/");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip")).toBeFocused();
  });

  test("a troca de idioma leva à versão em inglês", async ({ page }) => {
    await page.goto("/pt/");
    await page.getByRole("link", { name: "Read in English" }).click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.getByRole("link", { name: "View projects" })).toBeVisible();
  });
});
