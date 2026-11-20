import type { Dictionary } from "@/content/site";

// Divide uma palavra em letras para a entrada em cascata; o leitor de tela lê o rótulo inteiro.
function Letters({ word, offset = 0 }: { word: string; offset?: number }) {
  return (
    <>
      {Array.from(word).map((ch, i) => (
        <span key={i} className="ltr" style={{ ["--i" as string]: i + offset }} aria-hidden="true">
          {ch}
        </span>
      ))}
    </>
  );
}

export default function Hero({ t }: { t: Dictionary }) {
  const h = t.hero;
  return (
    <section className="hero" id="inicio" data-scene aria-labelledby="hero-name">
      <h1 id="hero-name" className="hero-name" aria-label={`${h.first} ${h.last}`}>
        <span className="hero-word hero-first" data-parallax="first">
          <Letters word={h.first} />
        </span>
        <span className="hero-word hero-last" data-parallax="last">
          <Letters word={h.last} offset={4} />
        </span>
      </h1>

      <div className="hero-copy" data-parallax="copy">
        <p className="hero-disciplines">
          {h.disciplines.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </p>
        <p className="hero-lede">{h.lede}</p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#projetos">
            <span>{h.ctaWork}</span>
          </a>
          <a className="btn btn-ghost" href="#contato">
            <span>{h.ctaContact}</span>
          </a>
        </div>
      </div>

      <a className="hero-scroll" href="#intro" data-parallax="copy">
        <span className="hero-scroll-line" aria-hidden="true" />
        {h.scroll}
      </a>
    </section>
  );
}
