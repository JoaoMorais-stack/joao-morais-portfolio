import { LINKS, type Dictionary } from "@/content/site";

// Segurança ofensiva: método (sequência real, por isso numerada), prática,
// ferramentas, anotações e certificações. O mapa de ataque fica ao lado.
export default function Security({ t }: { t: Dictionary }) {
  const s = t.security;
  return (
    <section className="security" id="seguranca" data-scene aria-labelledby="security-title">
      <div className="security-inner">
        <header className="security-head">
          <h2 id="security-title" className="section-title">
            {s.heading}
          </h2>
          <p className="security-lede">{s.lede}</p>
        </header>

        <div className="security-method">
          <h3 className="security-sub">{s.methodHeading}</h3>
          <ol className="steps">
            {s.steps.map((step, i) => (
              <li key={step.title} className="step" data-reveal>
                <span className="step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="security-grid">
          <div className="security-block" data-reveal>
            <h3 className="security-sub">{s.practiceHeading}</h3>
            <dl className="practice">
              {s.practice.map((p) => (
                <div key={p.name}>
                  <dt>{p.name}</dt>
                  <dd>{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="security-block" data-reveal>
            <h3 className="security-sub">{s.toolsHeading}</h3>
            <ul className="stack" aria-label={s.toolsHeading}>
              {s.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
          <div className="security-block" data-reveal>
            <h3 className="security-sub">{s.notesHeading}</h3>
            <p className="security-text">{s.notes}</p>
          </div>
          <div className="security-block" data-reveal>
            <h3 className="security-sub">{s.certHeading}</h3>
            <ul className="certs">
              {s.certs.map((c) => (
                <li key={c.name}>
                  <span className="cert-name">{c.name}</span>
                  <span className="cert-status">{c.status}</span>
                </li>
              ))}
            </ul>
            <p className="security-note">{s.certNote}</p>
          </div>
        </div>

        <a className="link-arrow" href={LINKS.pentestLabs} target="_blank" rel="noopener noreferrer">
          {s.repoLink}
        </a>
      </div>
    </section>
  );
}
