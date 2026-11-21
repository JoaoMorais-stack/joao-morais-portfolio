import { LINKS, type Dictionary } from "@/content/site";

export function About({ t }: { t: Dictionary }) {
  return (
    <section className="about" id="sobre" data-opaque aria-labelledby="about-title">
      <figure className="about-photo">
        <img
          src="/media/about/joao-morais-1100.webp"
          srcSet="/media/about/joao-morais-640.webp 640w, /media/about/joao-morais-1100.webp 1100w"
          sizes="(max-width: 760px) 92vw, 40vw"
          width={1100}
          height={1100}
          loading="lazy"
          decoding="async"
          alt={t.about.photoAlt}
        />
      </figure>
      <div className="about-text">
        <h2 id="about-title" className="section-title">
          {t.about.heading}
        </h2>
        {t.about.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </section>
  );
}

export function Contact({ t }: { t: Dictionary }) {
  return (
    <section className="contact" id="contato" data-scene aria-labelledby="contact-title">
      <h2 id="contact-title" className="contact-title">
        {t.contact.heading}
      </h2>
      <p className="contact-body">{t.contact.body}</p>
      <ul className="contact-links">
        <li>
          <a href={`mailto:${LINKS.email}`}>
            <span className="contact-label">{t.contact.email}</span>
            <span className="contact-value">{LINKS.email}</span>
          </a>
        </li>
        <li>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="contact-label">{t.contact.linkedin}</span>
            <span className="contact-value">in/joaomorais-infosec</span>
          </a>
        </li>
        <li>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
            <span className="contact-label">{t.contact.github}</span>
            <span className="contact-value">JoaoMorais-stack</span>
          </a>
        </li>
      </ul>
    </section>
  );
}
