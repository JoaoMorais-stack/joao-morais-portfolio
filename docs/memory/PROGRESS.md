# Progresso

## 2026-11-20 — Fases 1 a 4 (protótipo para revisão)

Feito e verificado:
- Auditoria do GitHub: 5 apps executados e capturados (desktop + mobile), testes de todos passando.
- 9 referências do 21st.dev + 5 templates abertos ao vivo e avaliados (`docs/REFERENCES.md`).
- Hero com cena WebGL2 própria, entrada cinematográfica, cursor, 4 poses de câmera ligadas ao scroll.
- Introdução, vitrine 3D do Ebinex (screenshot real), galeria em faixas com 4 projetos reais, sobre (foto), contato.
- PT/EN, Open Graph, hreflang, JSON-LD, fallback sem WebGL (render real da cena), movimento reduzido.
- 18 testes Playwright passando; screenshots em 375/430/768/1440/1920 em `screenshots/final/`.
- Medição: ~51–54 FPS em GPU integrada AMD (1920×1080 e 1440×900@2x), CLS 0.

Pendente (aguarda revisão do João antes da fase 5):
- Seções de cibersegurança e competências/soluções; mais cases; página de projeto.
- Mandarin Learning App: rodar Expo web e capturar.
- Casos sanitizados dos projetos privados (exige autorização por projeto).
- Revisar textos pessoais (FAB/HFASP, e-mail) antes de publicar.
- Conferir termos do Cloudflare Pages e publicar só com autorização.
- Teste em aparelho real (iPhone/Android) e em GPU fraca.

## 2026-11-20 — Publicação (autorizada pelo João)

- GitHub: `JoaoMorais-stack/joao-morais-portfolio` (privado). `main` = produção.
- Vercel: projeto `joao-morais-portfolio` (conta joaomorais-stack, plano Hobby).
  Produção: https://joao-morais-portfolio-ecru.vercel.app — publicado pela CLI (`npx vercel@66.6.0 deploy --prod`).
- Deploy automático por push **não ligado**: o app da Vercel no GitHub não tem acesso ao repositório novo.
  Depois de liberar em github.com/settings/installations → Vercel → Repository access, rodar `npx vercel git connect`.
- Verificado no endereço publicado: 18/18 testes Playwright (`BASE_URL=... npx playwright test`),
  cabeçalhos de segurança, canonical/OG com o domínio de produção, cena WebGL ao vivo sem erros de console.
- Corrigido após o deploy: sobra horizontal de 7–11 px do celular flutuante em 768 px.
