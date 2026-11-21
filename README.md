# João Morais — portfólio "Singularity"

Portfólio pessoal bilíngue (PT/EN) de João Morais: cibersegurança, software e automação.
Protótipo da fase 4 (hero cinematográfico + primeira vitrine de projetos), aguardando revisão.

## Rodar localmente

```powershell
npm install
npm run build      # exportação estática em out/
npm run serve      # http://127.0.0.1:3210/pt/
```

Desenvolvimento com recarga: `npm run dev` (http://localhost:3210/pt/).

## Verificação

```powershell
npm run typecheck
npx playwright test                         # 18 testes contra o build servido
node scripts/visual-check.mjs               # screenshots em 1920/1440/768/430/375
node scripts/perf-check.mjs                 # FPS, escala interna, peso e CLS
```

Parâmetros úteis na URL: `?nowebgl` força o fallback estático; `?capture` mostra só a cena.

## Estrutura

| Caminho | Papel |
|---|---|
| `app/[lang]/` | Páginas `/pt/` e `/en/`, metadados, Open Graph, hreflang |
| `app/(root)/` | `/` redireciona pelo idioma do navegador |
| `content/site.ts` | Todo o texto e a lista de projetos (edite aqui) |
| `lib/attackmap/` | Cena 3D do mapa de ataque (Three.js), poses de câmera ligadas ao scroll |
| `components/hero/` | Hero (servidor) e palco WebGL (cliente, carregado sob demanda) |
| `components/work/` | Vitrine 3D do projeto em destaque e galeria em faixas |
| `components/site/` | Cabeçalho, introdução, sobre/contato, diretor de scroll (GSAP) |
| `scripts/` | Servidor estático local, otimização de mídia, capturas, checagens |
| `public/media/` | Screenshots reais (WebP), foto, fallback da cena, imagem OG |
| `docs/` | Referências, auditoria do GitHub, memória do projeto |

## Dependências

| Pacote | Versão | Licença | Por quê |
|---|---|---|---|
| next | 16.4.6 | MIT | App Router com exportação estática (hospedagem gratuita) |
| react / react-dom | 19.3.1 | MIT | Base do Next |
| gsap | 3.15.1 | Standard "no charge" (uso comercial gratuito) | ScrollTrigger: scroll nativo ligado à câmera e às transições |
| typescript | ~5.9 (dev) | Apache-2.0 | Tipagem |
| @playwright/test | 1.65.1 (dev) | Apache-2.0 | Testes e inspeção visual (usa o Chrome instalado) |
| sharp | 0.35.5 (dev) | Apache-2.0 | Conversão das capturas para WebP |

Fontes via `next/font` (embutidas no build, sem chamada externa em produção):
Archivo (eixo de largura) e Instrument Serif — ambas SIL OFL.

A cena do hero ("mapa de ataque") usa Three.js 0.187 (MIT), carregado sob demanda depois da
primeira pintura. Sem Tailwind: o CSS é escrito à mão com tokens.

## Hospedagem

Build 100% estático (`out/`), publicado na Vercel com deploy automático a cada push:
`main` vai para produção e as outras branches geram links de pré-visualização.
Cabeçalhos de segurança em `vercel.json`. Rollback: promover um deploy anterior no painel
da Vercel ou reverter o commit em `main`.
