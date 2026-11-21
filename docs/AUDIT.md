# Auditoria do GitHub (2026-11-20)

Conta: `JoaoMorais-stack`. O portfólio antigo
(`moraissec-portfolio`) foi ignorado no design, por pedido; dele só foram reaproveitados fatos
já publicados (contatos, formação, trajetória).

## Repositórios prioritários

Todos clonados em `_audit/` (fora do Git), executados localmente e testados.
Todos os commits são de João Morais; nenhum é fork.

| Repositório | Stack | Executou? | Testes | Captura | Observação |
|---|---|---|---|---|---|
| ebinex-platform | Node.js 20+, JS, Canvas, node:test | Sim, `node server.js` → 127.0.0.1:4173 | 11/11 ok (`npm test`) | desktop + mobile | Simulação fictícia de paper trading. Console do app mostra 13–14 erros no navegador (não investigado; não afeta a captura). |
| clinical-nutrition-automation-demo | Python, SQLite, HTTP local | Sim, `run_demo.py` → 8765, clicado "Run demonstration" | 6/6 ok | desktop + mobile | Versão sanitizada de automação hospitalar real. Dados sintéticos. |
| workforce-management-demo | Python, SQLite, API JSON | Sim, porta 5000 | 7/7 ok | desktop + mobile | Dados fictícios. |
| shift-schedule-generator | Python, SQLite | Sim, porta 5100 | 8/8 ok | desktop + mobile | Interface em português; registros fictícios. |
| student-portal-automation-demo | Python stdlib, urllib | Sim, porta 8766, clicado "Run authorized demo" | 6/6 ok | desktop + mobile | Bloqueia alvos não locais no código. |
| mandarin-learning-app | Expo, React Native, TS, Supabase | **Não executado** | não rodado | nenhuma | Fora do portfólio por decisão do João (ainda incompleto). |
| pentest-labs | Markdown | — | — | — | Só estrutura e templates; README diz que ainda não há write-ups públicos. Não há o que exibir como projeto. |

## Outros repositórios

- `JonathanAsf`: **fork** de perfil de terceiro. Excluído.
- Repositórios privados não foram abertos nem são citados aqui. Só entram no portfólio
  como case sanitizado, com autorização explícita do João para cada um.

## Fatos reaproveitados do portfólio antigo (já públicos)

E-mail `vitor.infosec@gmail.com`, LinkedIn `in/joaomorais-infosec`, GitHub, São Paulo,
Cabo da FAB no HFASP desde 2022, Tecnólogo em Cyber Segurança (Anhanguera, previsão 2028),
labs na Solyd, TryHackMe e Hack The Box. Certificações aparecem lá como "em preparação" e
**não** foram citadas como concluídas.
