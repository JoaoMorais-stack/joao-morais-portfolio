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
