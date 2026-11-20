import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { DICT, LOCALES, isLocale } from "@/content/site";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Endereço público definitivo ainda não definido (publicação pendente de autorização).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3210";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = DICT[lang].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${lang}/`,
      languages: { "pt-BR": "/pt/", en: "/en/" },
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      url: `/${lang}/`,
      images: [{ url: "/media/og-singularity.jpg", width: 1200, height: 630, alt: t.title }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
    authors: [{ name: "João Morais", url: "https://github.com/JoaoMorais-stack" }],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang === "pt" ? "pt-BR" : "en"} className={`${archivo.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
