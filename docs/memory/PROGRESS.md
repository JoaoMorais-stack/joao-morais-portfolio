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

## 2026-11-21 — Hero "mapa de ataque" em produção

- Aprovado pelo João na prévia e publicado (main = 7e2eefe). Deploy automático GitHub → Vercel funcionando.
- Verificado em produção: 18/18 testes, cena ao vivo sem erros de console, fallback e OG novos servidos.
- Textos reescritos em primeira pessoa (sem slogans) também estão no ar.

Próximos candidatos (fase 5): seção de segurança ofensiva/competências, captura do Mandarin App,
cases sanitizados de projetos privados (com autorização), limpeza da documentação para tornar o repositório público.

## 2026-11-21 — Seção de segurança ofensiva (em produção)

- Branch `feat/security-section`. Método em 5 etapas copiado do `pentest-labs/methodology` (autorização e escopo,
  mapeamento, hipótese e validação, comunicação do risco, revisão antes de publicar).
- Plataformas, ferramentas, anotações (Obsidian) e certificações vêm do portfólio antigo; eJPT "em preparação",
  OSCP "objetivo a longo prazo", com aviso "nenhuma concluída". **Confirmar com o João se o status mudou.**
- O mapa de ataque ganhou uma pose nova (camadas separadas ao lado do método). 19/19 testes.
- Aprovada pelo João e publicada (main = 98589c3). 19/19 testes no endereço de produção.

## 2026-11-21 — Páginas de case (em produção)

- Branch `feat/case-pages`. Rota estática `/[lang]/cases/[slug]/` para os 5 projetos (10 páginas).
- Conteúdo só de README/código: problema, recursos, arquitetura (fluxo), testes e segurança, limites, como rodar.
- Corrigida afirmação não comprovada: a automação real do hospital é de consolidação sistema ↔ planilhas;
  a demo usa casos de nutrição fictícios (não "a rotina de nutrição do hospital").
- Logo trocado para três camadas empilhadas (coerente com o mapa de ataque). Mandarin App descartado pelo João (incompleto).
- 23/23 testes.
- Aprovadas pelo João e publicadas (main = 70e3bdf). 23/23 testes em produção; as 10 rotas respondem 200.

## 2026-11-21 — Repositório público

- README reescrito para visitantes; nomes de repositórios privados e caminho local removidos da documentação.
- Histórico reescrito (git filter-branch) com autorização do João, só nessas linhas; árvore final idêntica.
  Branches de recurso já incorporados foram apagados. Cópia do histórico antigo em
  `_audit_runtime/historico-antes-da-limpeza-2026-11-21.bundle` (fora do Git).
- Repositório tornado público, com o site como homepage. Vercel seguiu publicando; 23/23 testes em produção.

## 2026-11-21 — Revisão de qualidade (em produção)

- Branch `feat/quality-pass`. axe-core (WCAG 2.0/2.1/2.2 A e AA + boas práticas) em 4 páginas × desktop/celular: 0 violações.
  Corrigido: nome acessível do link de idioma ("EN (Read in English)"), bloco de comandos que rolava sem foco,
  contraste da frase da introdução (agora acende de #85817a), rótulo da navegação, âncoras sob o cabeçalho fixo,
  links ocultos pelo parallax saem do foco (autoAlpha).
- Desempenho: cena 3D e GSAP carregam depois do `load`; em telas de toque, só na primeira interação ou após 5 s
  (a imagem estática é a mesma cena). Telas de celular com variante 320w. Pausa da cena agora por cobertura de seção opaca
  (antes, com a seção de segurança, ela nunca pausava).
- Lighthouse local (servidor com brotli): celular 82–91 de desempenho (antes 77 em produção), acessibilidade 100,
  boas práticas 100, SEO 100; desktop 97–100. LCP de laboratório no celular segue ~3,1–3,3 s (hidratação do React
  na CPU simulada); fontes e animação do nome foram testadas e descartadas como causa.
- Segurança: npm audit 0, OSV-Scanner 0 (74 pacotes), Semgrep 0 alertas (30 arquivos). 31/31 testes.
- Publicada (main = 0307406). Produção: 31/31 testes; Lighthouse celular 80–86 (antes 77), TBT 370–620 ms (antes 710),
  LCP 2,8 s, 388 KB (antes 611 KB), acessibilidade 100; desktop 98, acessibilidade 100.

## 2026-11-22 — Novos visuais dos apps no portfólio
- Redesign só de front nos 5 repositórios de demonstração, cada um com identidade própria: Ebinex (violeta neon), Clinical (violeta com ciano), Student (vidro diurno claro), Workforce (grafite e esmeralda), Gerador de Escalas (azul-noite e dourado). Um estilo neo-brutalista para o Workforce foi rejeitado pelo usuário e descartado.
- PRs abertos em cada repositório (branch `design/premium-ui`); merge aprovado pelo usuário, mas bloqueado pela política de permissões da sessão — fazer pelo GitHub.
- Capturas refeitas com `scripts/capture-projects.mjs` (apps rodando localmente) + `npm run media`. Capturas anteriores em `_captures/anterior-2026-11-20/`.
- Galeria: véu mais forte atrás do texto do painel aberto (capturas com tabela densa).
- Ambiente: após atualização do Windows, o primeiro `import sqlite3` levou ~34 s; os servidores Python só respondem depois disso. Rodar pelo painel Terminal.
- Testes: typecheck, build e 31/31 e2e + axe.
- Publicado em produção em 2026-11-22 (commit 65e974b, fast-forward de `main`). As 10 imagens em produção conferem por hash com as locais; /pt/, /en/ e páginas de case respondem 200; inspeção visual da produção em 1440 e 375 sem estouro de largura e sem erros. Evidências em `screenshots/producao-2026-11-22/`.
- Pendente: o usuário mesclar os 5 PRs `design/premium-ui` no GitHub (o merge foi bloqueado pela permissão da sessão).
- Atualização: os 5 PRs foram mesclados pelo João no GitHub em 2026-11-22; clones locais sincronizados com `main`.

## 2026-11-22 — Cases privados: LeadFinder (prévia)
- Plano aprovado: Audit com telas reais; LeadFinder só com dados fictícios ou só texto; Studio fora; nada alterado nos repositórios privados.
- LeadFinder: interface React real rodando no Vite, com o backend Tauri substituído no navegador por um mock só com empresas fictícias (sites `.example`, telefones 5555). Nenhum banco aberto — a pasta de dados de dev do João não foi tocada. Mock e script ficam fora do Git (`_audit_runtime/leadfinder-tools/`), porque revelam a estrutura interna do app privado.
- Projeto pode não ter `repo` (código privado) e ser `desktopOnly` (sem celular); página de case ganha "Outras telas".
- Testes do case: vitest 9/9 executado hoje; cargo 156/156 vem do registro do próprio projeto (versão 0.4.3) — a compilação local está lenta por causa do antivírus.
- Audit: o app recusa domínios reservados (`example.com`) por design; analisar domínio de terceiros exporia dados reais. Pendente decisão do João: usar um domínio dele ou publicar o case só em texto.
- 33/33 testes (inclui axe na página nova).
