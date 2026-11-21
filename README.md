# João Morais — portfólio

Site pessoal de João Morais, desenvolvedor de software e pentester em formação (São Paulo, Brasil).
Bilíngue (português e inglês), com uma cena 3D no início que mostra como eu construo e testo um sistema.

**No ar:** https://joao-morais-portfolio-ecru.vercel.app

## O que tem aqui

- **Hero "mapa de ataque":** a arquitetura de um sistema (interface, API, banco, servidor e automações) desenhada
  como planta técnica em Three.js. Uma varredura percorre as camadas, um caminho de ataque aparece em vermelho
  (`GET /api/contas/1042 → 200`) e é corrigido em azul (`→ 403`). É uma ilustração, não um caso real.
- **Projetos:** vitrine e galeria com telas capturadas das aplicações rodando localmente, e uma página de case
  para cada projeto (problema, arquitetura, testes, segurança, limites e como rodar).
- **Segurança ofensiva:** o método que sigo nos laboratórios, onde pratico e o status das certificações.
- **Sobre e contato.**

## Como rodar

Requer Node.js 20 ou mais novo.

```bash
npm install
npm run build      # exportação estática em out/
npm run serve      # http://127.0.0.1:3210/pt/
```

Desenvolvimento com recarga: `npm run dev` (http://localhost:3210/pt/).

## Testes e verificação

```bash
npm run typecheck
npx playwright test                              # contra o build local
BASE_URL=https://... npx playwright test         # contra um endereço publicado
node scripts/visual-check.mjs                    # capturas em 1920/1440/768/430/375
node scripts/perf-check.mjs                      # FPS, peso transferido e CLS
```

Os testes cobrem metadados e SEO, links, a cena 3D e as alternativas sem WebGL e com movimento reduzido,
ausência de rolagem lateral em cinco larguras, navegação por teclado, menu do celular, troca de idioma e as
páginas de case. Parâmetros úteis na URL: `?nowebgl` força a imagem estática e `?capture` mostra só a cena.

## Estrutura

| Caminho | Papel |
|---|---|
| `content/site.ts` | Todo o texto (PT/EN) e a lista de projetos |
| `content/cases.ts` | Conteúdo das páginas de case |
| `app/[lang]/` | Página inicial e cases em `/pt/` e `/en/`, metadados e Open Graph |
| `lib/attackmap/` | Cena 3D (Three.js) e poses de câmera ligadas ao scroll |
| `components/` | Seções, vitrine, galeria, cabeçalho e diretor de scroll (GSAP) |
| `scripts/` | Servidor estático local, mídia, capturas, checagens de qualidade |
| `public/media/` | Telas dos projetos em WebP, foto, imagem estática da cena e Open Graph |
| `docs/` | Decisões, referências e registro do projeto |

## Tecnologia

| Pacote | Licença | Uso |
|---|---|---|
| Next.js 16 / React 19 | MIT | Exportação estática, sem servidor |
| Three.js 0.187 | MIT | Cena do hero, carregada depois da primeira pintura |
| GSAP 3.15 | Licença padrão gratuita da GSAP | Scroll nativo ligado à câmera e às transições |
| TypeScript, Playwright, sharp | Apache-2.0 | Tipagem, testes e conversão de imagens |

Fontes Archivo e Instrument Serif (SIL OFL), embutidas no build. CSS escrito à mão, sem framework.
Hospedado na Vercel com deploy automático a cada push na `main`; cabeçalhos de segurança em `vercel.json`.

## Direitos

O código está aqui para leitura e referência. Textos, fotos, capturas dos projetos e a identidade visual
são de João Morais, com todos os direitos reservados.
