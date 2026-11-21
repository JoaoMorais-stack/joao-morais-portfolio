import type { Dictionary, Locale, Project } from "@/content/site";
import { CASE_UI, type CaseStudy } from "@/content/cases";
import SiteHeader from "@/components/site/SiteHeader";

type Props = { t: Dictionary; lang: Locale; project: Project; study: CaseStudy; next: Project };

// Página de case: leve (sem cena 3D), com as telas reais, o problema, a
// arquitetura, testes e segurança, limites e como rodar. Tudo vem do README.
export default function CasePage({ t, lang, project, study, next }: Props) {
  const ui = CASE_UI[lang];
  const other = lang === "pt" ? "en" : "pt";
  const base = `/media/projects/${project.shot}`;
  const repoName = project.repo.split("/").pop();

  return (
    <>
      <a className="skip" href="#conteudo">
        {t.skip}
      </a>
      <SiteHeader t={t} lang={lang} base={`/${lang}/`} switchHref={`/${other}/cases/${project.slug}/`} />
      <main id="conteudo" className="case">
        <a className="case-back" href={`/${lang}/#projetos`}>
          {ui.back}
        </a>

        <header className="case-hero">
          <p className="case-kind">{project.kind[lang]}</p>
          <h1 className="case-title">{project.name}</h1>
          <p className="case-summary">{project.summary[lang]}</p>
          <ul className="case-facts">
            <li>{study.status[lang]}</li>
            <li>{ui.tests(study.tests)}</li>
            <li>{project.note[lang]}</li>
          </ul>
          <a className="btn btn-primary" href={project.repo} target="_blank" rel="noopener noreferrer">
            <span>{ui.repo}</span>
          </a>
        </header>

        <figure className="case-shots">
          <div className="device-browser">
            <div className="browser-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>127.0.0.1</p>
            </div>
            <img
              src={`${base}-desktop-1600.webp`}
              srcSet={`${base}-desktop-960.webp 960w, ${base}-desktop-1600.webp 1600w`}
              sizes="(max-width: 760px) 92vw, 70vw"
              width={1600}
              height={1000}
              decoding="async"
              fetchPriority="high"
              alt={lang === "pt" ? `Tela do ${project.name} no desktop, rodando localmente.` : `${project.name} on desktop, running locally.`}
            />
          </div>
          <div className="case-phone">
            <img
              src={`${base}-mobile-520.webp`}
              width={520}
              height={1125}
              loading="lazy"
              decoding="async"
              alt={lang === "pt" ? `${project.name} na largura de um celular.` : `${project.name} at phone width.`}
            />
          </div>
        </figure>

        <div className="case-body">
          <section className="case-section" aria-labelledby="c-problem">
            <h2 id="c-problem">{ui.problem}</h2>
            <div>
              <p className="case-lead">{study.problem[lang]}</p>
            </div>
          </section>

          <section className="case-section" aria-labelledby="c-features">
            <h2 id="c-features">{ui.features}</h2>
            <ul className="case-list">
              {study.features[lang].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          <section className="case-section" aria-labelledby="c-flow">
            <h2 id="c-flow">{ui.flow}</h2>
            <div>
              <ol className="flow">
                {study.flow[lang].map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ol>
              <p className="case-note">{study.flowNote[lang]}</p>
              <ul className="stack" aria-label="Stack">
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="case-section" aria-labelledby="c-safety">
            <h2 id="c-safety">{ui.safety}</h2>
            <ul className="case-list">
              {study.safety[lang].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          <section className="case-section" aria-labelledby="c-limits">
            <h2 id="c-limits">{ui.limits}</h2>
            <ul className="case-list case-list-dim">
              {study.limits[lang].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          <section className="case-section" aria-labelledby="c-run">
            <h2 id="c-run">{ui.run}</h2>
            <pre className="case-code">
              <code>{`git clone ${project.repo}\ncd ${repoName}\n${study.run}`}</code>
            </pre>
          </section>
        </div>

        <a className="case-next" href={`/${lang}/cases/${next.slug}/`}>
          <span className="case-next-label">{ui.next}</span>
          <span className="case-next-name">{next.name}</span>
        </a>
      </main>
      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {t.footer}
        </p>
      </footer>
    </>
  );
}
