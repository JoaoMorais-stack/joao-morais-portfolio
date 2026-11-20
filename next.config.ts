import type { NextConfig } from "next";

// Exportação estática: o build gera HTML/CSS/JS puros em out/, publicáveis
// em qualquer hospedagem estática gratuita (ex.: Cloudflare Pages).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
