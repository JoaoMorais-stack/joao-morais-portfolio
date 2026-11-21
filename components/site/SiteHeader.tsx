"use client";

import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/content/site";

export default function SiteHeader({ t, lang }: { t: Dictionary; lang: Locale }) {
  const [open, setOpen] = useState(false);
  const other = lang === "pt" ? "en" : "pt";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "#projetos", label: t.nav.work },
    { href: "#seguranca", label: t.nav.security },
    { href: "#sobre", label: t.nav.about },
    { href: "#contato", label: t.nav.contact },
  ];

  return (
    <header className="site-header" data-open={open || undefined}>
      <a className="mark" href="#inicio" aria-label="João Morais">
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <circle cx="16" cy="16" r="11.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
          <ellipse cx="16" cy="16" rx="15" ry="3.6" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-14 16 16)" />
          <circle cx="16" cy="16" r="5.2" fill="currentColor" />
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
            <a href={`/${other}/`} hrefLang={other === "pt" ? "pt-BR" : "en"} lang={other === "pt" ? "pt-BR" : "en"} aria-label={t.nav.switchLabel}>
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
