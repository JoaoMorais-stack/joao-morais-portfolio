import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DICT, LOCALES, PROJECTS, isLocale } from "@/content/site";
import { CASES } from "@/content/cases";
import CasePage from "@/components/work/CasePage";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => CASES.map((c) => ({ lang, slug: c.slug })));
}

type Params = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} | João Morais`;
  const description = project.summary[lang];
  const shot = `/media/projects/${project.shot}-desktop-1600.webp`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/cases/${slug}/`,
      languages: { "pt-BR": `/pt/cases/${slug}/`, en: `/en/cases/${slug}/` },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${lang}/cases/${slug}/`,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      images: [{ url: shot, width: 1600, height: 1000, alt: project.name }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: Params) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const study = CASES.find((c) => c.slug === slug);
  if (index < 0 || !study) notFound();
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  return <CasePage t={DICT[lang]} lang={lang} project={project} study={study} next={next} />;
}
