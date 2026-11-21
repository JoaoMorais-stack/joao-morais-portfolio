"use client";

import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/content/site";

type Props = {
  t: Dictionary;
  lang: Locale;
  /** prefixo dos links de seção: "" na página inicial, "/pt/" nas páginas de case */
  base?: string;
  /** destino da troca de idioma (padrão: página inicial do outro idioma) */
  switchHref?: string;
};

export default function SiteHeader({ t, lang, base = "", switchHref }: Props) {
  const [open, setOpen] = useState(false);
  const other = lang === "pt" ? "en" : "pt";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: `${base}#projetos`, label: t.nav.work },
    { href: `${base}#seguranca`, label: t.nav.security },
    { href: `${base}#sobre`, label: t.nav.about },
    { href: `${base}#contato`, label: t.nav.contact },
  ];

  return (
    <header className="site-header" data-open={open || undefined}>
      <a className="mark" href={`${base}#inicio`} aria-label="João Morais">
        {/* três camadas empilhadas, como no mapa de ataque */}
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M16 4 28 10 16 16 4 10Z" />
          <path d="M4 16 16 22 28 16" opacity="0.7" />
          <path d="M4 22 16 28 28 22" opacity="0.45" />
        </svg>
        <span className="mark-text">João Morais</span>
      </a>

      <nav className="nav" aria-label={t.nav.menu}>
        <ul id="site-nav" className="nav-list">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li className="nav-lang">
            <a href={switchHref ?? `/${other}/`} hrefLang={other === "pt" ? "pt-BR" : "en"} lang={other === "pt" ? "pt-BR" : "en"} aria-label={t.nav.switchLabel}>
              {t.nav.switchTo}
            </a>
          </li>
        </ul>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t.nav.close : t.nav.menu}
        </button>
      </nav>
    </header>
  );
}
