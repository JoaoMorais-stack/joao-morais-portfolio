"use client";

import { useRef, useState } from "react";
import type { Dictionary, Locale, Project } from "@/content/site";
import { CASE_UI } from "@/content/cases";

// Galeria em faixas: um projeto aberto, os demais comprimidos.
// Abre por hover (ponteiro fino), foco, toque/clique e setas do teclado.
export default function SqueezeGallery({ projects, t, lang }: { projects: Project[]; t: Dictionary; lang: Locale }) {
  const [active, setActive] = useState(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = projects.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      setActive(next);
      triggers.current[next]?.focus();
    }
  };

  return (
    <div className="gallery">
      <div className="gallery-head">
        <h3 className="gallery-title">{t.work.galleryHeading}</h3>
        <p className="gallery-hint">{t.work.galleryHint}</p>
      </div>
      <ul className="squeeze">
        {projects.map((p, i) => {
          const open = i === active;
          const base = `/media/projects/${p.shot}`;
          return (
            <li
              key={p.slug}
              className="panel"
              data-open={open || undefined}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            >
              <img
                className="panel-shot"
                src={`${base}-desktop-960.webp`}
                srcSet={`${base}-desktop-960.webp 960w, ${base}-desktop-1600.webp 1600w`}
                sizes="(max-width: 760px) 92vw, 60vw"
                width={960}
                height={600}
                loading="lazy"
                decoding="async"
                alt={lang === "pt" ? `Tela real do ${p.name} rodando localmente.` : `Real screen of ${p.name} running locally.`}
              />
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                className="panel-trigger"
                aria-expanded={open}
                aria-controls={`panel-${p.slug}`}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="panel-name">{p.name}</span>
              </button>
              <div className="panel-body" id={`panel-${p.slug}`} hidden={!open}>
                <p className="panel-kind">{p.kind[lang]}</p>
                <p className="panel-summary">{p.summary[lang]}</p>
                <p className="panel-note">{p.note[lang]}</p>
                <div className="panel-foot">
                  <ul className="stack stack-sm" aria-label="Stack">
                    {p.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="panel-links">
                    <a className="link-arrow" href={`/${lang}/cases/${p.slug}/`} tabIndex={open ? 0 : -1}>
                      {CASE_UI[lang].viewCase}
                    </a>
                    <a className="link-arrow link-quiet" href={p.repo} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
