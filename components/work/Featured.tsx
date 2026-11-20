import type { Dictionary, Locale, Project } from "@/content/site";

// Vitrine principal: a tela real do projeto em uma superfície 3D, iluminada
// por trás pela singularidade, com a versão mobile flutuando à frente.
export default function Featured({ project, t, lang }: { project: Project; t: Dictionary; lang: Locale }) {
  const base = `/media/projects/${project.shot}`;
  return (
    <article className="featured" data-scene aria-labelledby={`p-${project.slug}`}>
      <div className="featured-stage" data-tilt>
        <div className="featured-rig" data-rig>
          <figure className="device-browser">
            <div className="browser-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>127.0.0.1:4173</p>
            </div>
            <img
              src={`${base}-desktop-1600.webp`}
              srcSet={`${base}-desktop-960.webp 960w, ${base}-desktop-1600.webp 1600w`}
              sizes="(max-width: 760px) 92vw, 64vw"
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              alt={
                lang === "pt"
                  ? "Painel do Ebinex com patrimônio simulado, gráfico de trajetória da carteira e alocação por ativo fictício."
                  : "Ebinex dashboard with simulated equity, portfolio trajectory chart and allocation by fictional asset."
              }
            />
          </figure>
          <figure className="device-phone">
            <img
              src={`${base}-mobile-520.webp`}
              width={520}
              height={1125}
              loading="lazy"
              decoding="async"
              alt={lang === "pt" ? "O mesmo painel do Ebinex na largura de um celular." : "The same Ebinex dashboard at phone width."}
            />
          </figure>
        </div>
      </div>

      <div className="featured-meta">
        <p className="featured-kind">{t.work.featuredKind}</p>
        <h3 id={`p-${project.slug}`} className="featured-name">
          {project.name}
        </h3>
        <p className="featured-type">{project.kind[lang]}</p>
        <p className="featured-summary">{project.summary[lang]}</p>
        <ul className="stack" aria-label="Stack">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="featured-note">
          {project.note[lang]} {t.work.captured}.
        </p>
        <a className="link-arrow" href={project.repo} target="_blank" rel="noopener noreferrer">
          {t.work.repo}
        </a>
      </div>
    </article>
  );
}
