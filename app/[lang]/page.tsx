import { notFound } from "next/navigation";
import { DICT, PROJECTS, isLocale } from "@/content/site";
import SiteHeader from "@/components/site/SiteHeader";
import SceneStage from "@/components/hero/SceneStage";
import Hero from "@/components/hero/Hero";
import Intro from "@/components/site/Intro";
import Featured from "@/components/work/Featured";
import SqueezeGallery from "@/components/work/SqueezeGallery";
import { About, Contact } from "@/components/site/AboutContact";
import ScrollDirector from "@/components/site/ScrollDirector";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = DICT[lang];
  const [featured, ...rest] = PROJECTS;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "João Morais",
    jobTitle: lang === "pt" ? "Desenvolvedor de software e pentester em formação" : "Software developer and pentester in training",
    address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressCountry: "BR" },
    sameAs: ["https://github.com/JoaoMorais-stack", "https://www.linkedin.com/in/joaomorais-infosec/"],
  };

  return (
    <>
      <a className="skip" href="#conteudo">
        {t.skip}
      </a>
      <SiteHeader t={t} lang={lang} />
      <SceneStage map={t.hero.map} />
      <main id="conteudo">
        <Hero t={t} />
        <Intro t={t} />
        <section className="work" id="projetos" aria-labelledby="work-title">
          <header className="work-head">
            <h2 id="work-title" className="section-title">
              {t.work.heading}
            </h2>
            <p className="work-lede">{t.work.lede}</p>
          </header>
          <Featured project={featured} t={t} lang={lang} />
          <SqueezeGallery projects={rest} t={t} lang={lang} />
        </section>
        <About t={t} />
        <Contact t={t} />
      </main>
      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {t.footer}
        </p>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ScrollDirector />
    </>
  );
}
