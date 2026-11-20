import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "João Morais",
  robots: { index: false, follow: true },
};

// Layout mínimo da raiz "/": só redireciona para o idioma certo.
export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#000", color: "#ece6da", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
