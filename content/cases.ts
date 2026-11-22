import type { Locale } from "./site";

// Cases dos projetos. Fonte: README e código de cada repositório (auditados em
// 2026-11-20/21). Contagem de testes = suíte executada localmente nessas datas.

type L<T> = Record<Locale, T>;

export type CaseStudy = {
  slug: string;
  tests: number;
  run?: string; // ausente = projeto privado, sem instruções de execução
  status: L<string>;
  problem: L<string>;
  features: L<string[]>;
  flow: L<string[]>;
  flowNote: L<string>;
  safety: L<string[]>;
  limits: L<string[]>;
};

export const CASES: CaseStudy[] = [
  {
    slug: "ebinex",
    tests: 11,
    run: "node server.js",
    status: { pt: "Demonstração funcional, versão 1.0.0", en: "Working demo, version 1.0.0" },
    problem: {
      pt: "Queria um projeto de interface financeira completo que qualquer pessoa pudesse abrir sem criar conta, informar dados ou depender de serviço externo. A saída foi simular tudo localmente, com regras determinísticas.",
      en: "I wanted a complete financial interface that anyone could open without creating an account, sharing data or relying on an outside service. The answer was to simulate everything locally with deterministic rules.",
    },
    features: {
      pt: [
        "Painel com patrimônio, saldo, alocação, lista de acompanhamento e atividade.",
        "Seis cenários de mercado fictícios, com preços e gráficos determinísticos.",
        "Compra e venda com saldo virtual e regras rígidas de quantidade e saldo.",
        "Histórico completo, preferências locais e restauração do cenário original em um clique.",
      ],
      en: [
        "Dashboard with equity, cash, allocation, watchlist and activity.",
        "Six fictional market scenarios with deterministic prices and charts.",
        "Buy and sell with a virtual balance and strict quantity and balance rules.",
        "Full history, local preferences and one-click reset of the original scenario.",
      ],
    },
    flow: {
      pt: ["Navegador", "Servidor HTTP local", "Validação e limite de requisições", "Serviço de simulação", "Estado em JSON descartável"],
      en: ["Browser", "Local HTTP server", "Validation and rate limit", "Simulation service", "Disposable JSON state"],
    },
    flowNote: {
      pt: "Sem pacotes externos: só a biblioteca padrão do Node.js, inclusive no servidor e nos testes.",
      en: "No external packages: only the Node.js standard library, including the server and the tests.",
    },
    safety: {
      pt: [
        "O servidor escuta só em 127.0.0.1 e recusa origens de navegador que não sejam locais.",
        "Corpo JSON limitado a 16 KiB e entradas com listas de valores permitidos e limites numéricos.",
        "Limite de requisições em memória e cabeçalhos de segurança com Content Security Policy.",
        "Testes cobrem cálculos da carteira, regras de saldo, validação, persistência, HTTP e o limite de requisições.",
      ],
      en: [
        "The server listens on 127.0.0.1 only and rejects non-local browser origins.",
        "JSON bodies are capped at 16 KiB and inputs use allowlists and numeric bounds.",
        "In-memory rate limiting and security headers with a Content Security Policy.",
        "Tests cover portfolio math, balance rules, validation, persistence, HTTP and rate limiting.",
      ],
    },
    limits: {
      pt: ["Preços e gráficos são ilustrações fixas.", "Um único perfil local, sem sistema de login."],
      en: ["Prices and charts are fixed illustrations.", "A single local profile with no login system."],
    },
  },
  {
    slug: "clinical",
    tests: 6,
    run: "python run_demo.py",
    status: { pt: "Demonstração funcional, versão 1.0.0", en: "Working demo, version 1.0.0" },
    problem: {
      pt: "No hospital onde trabalho, automatizei a consolidação de dados entre o sistema hospitalar e as planilhas do setor, com regras de negócio no meio. Não posso publicar esse código, então esta demonstração reproduz o mesmo tipo de fluxo com casos de nutrição inventados e sem conexão com nenhum sistema real.",
      en: "At the hospital where I work, I automated how data moves between the hospital system and the team's spreadsheets, with business rules in between. I can't publish that code, so this demo reproduces the same kind of flow with invented nutrition cases and no connection to any real system.",
    },
    features: {
      pt: [
        "Painel com revisão completa ou por área de atendimento.",
        "Regras determinísticas de risco e ação recomendada para cada caso.",
        "Resumo, distribuição por via de nutrição e registro de cada etapa do fluxo.",
        "Histórico local em SQLite e relatório em JSON para download.",
      ],
      en: [
        "Dashboard with a full review or one focused on a care area.",
        "Deterministic risk rules and a recommended action for each case.",
        "Summary, distribution by nutrition route and a trace of every workflow step.",
        "Local SQLite history and a downloadable JSON report.",
      ],
    },
    flow: {
      pt: ["Casos sintéticos (JSON)", "Adaptador de entrada", "Serviço de revisão", "Histórico em SQLite", "Painel e relatório"],
      en: ["Synthetic cases (JSON)", "Input adapter", "Review service", "SQLite history", "Dashboard and report"],
    },
    flowNote: {
      pt: "A fonte de dados fica isolada atrás de um adaptador, então trocar a origem não mexe nas regras.",
      en: "The data source sits behind an adapter, so changing where data comes from doesn't touch the rules.",
    },
    safety: {
      pt: [
        "Todos os casos são sintéticos; nenhum dado de paciente entra no repositório.",
        "Servidor só em 127.0.0.1, sem nenhuma integração de rede.",
        "Banco gerado em execução fica fora do controle de versão.",
        "Testes do serviço de revisão e da camada web, só com a biblioteca padrão do Python.",
      ],
      en: [
        "Every case is synthetic; no patient data enters the repository.",
        "Server on 127.0.0.1 only, with no network integration at all.",
        "The runtime database stays out of version control.",
        "Tests for the review service and the web layer, using only the Python standard library.",
      ],
    },
    limits: {
      pt: ["Não é apoio à decisão clínica; as recomendações são rótulos ilustrativos.", "Usa um conjunto pequeno e fixo de casos."],
      en: ["It is not clinical decision support; recommendations are illustrative labels.", "It uses a small, fixed set of cases."],
    },
  },
  {
    slug: "workforce",
    tests: 7,
    run: "python app.py",
    status: { pt: "Demonstração funcional, versão 1.0.0", en: "Working demo, version 1.0.0" },
    problem: {
      pt: "Equipes pequenas costumam guardar pessoas, disponibilidade e ausências em planilhas separadas, e perguntas simples (quem está ativo, quem sai de férias) viram trabalho manual. Juntei tudo num só lugar.",
      en: "Small teams often keep people, availability and time off in separate spreadsheets, so simple questions (who is active, who is on leave) become manual work. I brought it all into one place.",
    },
    features: {
      pt: [
        "Painel com equipe, status, ausências e capacidade semanal média.",
        "Distribuição por departamento e visão das ausências dos próximos 30 dias.",
        "Busca por nome, cargo ou e-mail e filtros por departamento e status.",
        "Cadastro, edição e remoção de pessoas e vários períodos de ausência por pessoa.",
      ],
      en: [
        "Dashboard with roster, status, time off and average weekly capacity.",
        "Distribution by department and a 30-day time-off view.",
        "Search by name, role or email and filters by department and status.",
        "Create, edit and remove people, with several time-off periods per person.",
      ],
    },
    flow: {
      pt: ["Interface no navegador", "API JSON", "Validação e regras", "SQLite"],
      en: ["Browser interface", "JSON API", "Validation and rules", "SQLite"],
    },
    flowNote: {
      pt: "Camadas separadas: rotas HTTP, regras de negócio e banco ficam em módulos próprios.",
      en: "Separate layers: HTTP routes, business rules and the database each live in their own module.",
    },
    safety: {
      pt: [
        "Dados fictícios, com e-mails no domínio reservado example.com.",
        "Servidor em 127.0.0.1 por padrão.",
        "Entradas com listas permitidas, limite de tamanho e validação de datas.",
        "Respostas com cabeçalhos de segurança restritivos.",
      ],
      en: [
        "Fictional data, with emails on the reserved example.com domain.",
        "Server on 127.0.0.1 by default.",
        "Inputs with allowlists, length limits and date validation.",
        "Responses with restrictive security headers.",
      ],
    },
    limits: {
      pt: ["Uso local por uma pessoa: sem login, permissões ou histórico de auditoria.", "Sem paginação; pensado para poucos registros."],
      en: ["Single-user local use: no login, permissions or audit history.", "No pagination; built for a small dataset."],
    },
  },
  {
    slug: "shift",
    tests: 8,
    run: "python app.py",
    status: { pt: "Demonstração pública funcional", en: "Working public demo" },
    problem: {
      pt: "Montar escala de fim de semana e feriado à mão é lento e injusto quando alguém está de férias ou não pode em certa data. O gerador aplica as regras e deixa a pessoa ajustar o que precisar.",
      en: "Building weekend and holiday rosters by hand is slow and unfair when someone is on leave or unavailable on a date. The generator applies the rules and lets people adjust what they need.",
    },
    features: {
      pt: [
        "Cadastro de colaboradores, equipes e ordem de rodízio.",
        "Escala de fins de semana e feriados respeitando férias e impedimentos.",
        "Completar só os dias vazios mantendo os ajustes manuais, ou refazer o período inteiro.",
        "Turnos semanais com alerta de conflito, totais e ranking por pessoa.",
      ],
      en: [
        "Employees, teams and rotation order.",
        "Weekend and holiday rosters that respect leave and unavailability.",
        "Fill only the empty days while keeping manual edits, or rebuild the whole period.",
        "Weekly shifts with conflict warnings, totals and per-person ranking.",
      ],
    },
    flow: {
      pt: ["Interface no navegador", "API JSON local", "Regras de escala", "SQLite"],
      en: ["Browser interface", "Local JSON API", "Scheduling rules", "SQLite"],
    },
    flowNote: {
      pt: "Nenhum pacote externo do Python. Sem nuvem, telemetria ou envio de dados.",
      en: "No third-party Python packages. No cloud, telemetry or data transfer.",
    },
    safety: {
      pt: [
        "Servidor só na máquina local.",
        "A entrega de arquivos estáticos recusa caminhos fora da pasta pública (path traversal).",
        "Testes cobrem datas, rodízio, disponibilidade, ajustes manuais, banco, API e a proteção de caminhos.",
      ],
      en: [
        "Server on the local machine only.",
        "Static file delivery rejects paths outside the public folder (path traversal).",
        "Tests cover dates, rotation, availability, manual edits, the database, the API and path protection.",
      ],
    },
    limits: {
      pt: ["As regras são ilustrativas, não um otimizador.", "Sem login nem edição simultânea por várias pessoas."],
      en: ["The rules are illustrative, not an optimizer.", "No login and no simultaneous editing by several people."],
    },
  },
  {
    slug: "student",
    tests: 6,
    run: "python run_demo.py serve",
    status: { pt: "Demonstração funcional", en: "Working demo" },
    problem: {
      pt: "Portais acadêmicos têm tarefas repetitivas de navegar e marcar progresso. Automatizar isso contra um portal real traria problemas de autorização, privacidade e termos de uso, então reconstruí o fluxo contra um portal simulado.",
      en: "Academic portals involve repetitive navigation and progress updates. Automating that against a real portal would raise authorization, privacy and terms-of-use issues, so I rebuilt the flow against a simulated portal.",
    },
    features: {
      pt: [
        "Portal local com cursos, aulas e progresso fictícios.",
        "Demonstração autorizada com um clique e registro de cada passo da automação.",
        "Cliente de linha de comando que faz o mesmo fluxo.",
        "Estado em memória, que volta ao início quando o servidor para.",
      ],
      en: [
        "Local portal with fictional courses, lessons and progress.",
        "One-click authorized demo with a trace of every automation step.",
        "A command-line client that runs the same flow.",
        "In-memory state that resets when the server stops.",
      ],
    },
    flow: {
      pt: ["Cliente de automação", "Validação do alvo", "Portal simulado em 127.0.0.1", "Dados fictícios em memória"],
      en: ["Automation client", "Target validation", "Simulated portal on 127.0.0.1", "Fictional in-memory data"],
    },
    flowNote: {
      pt: "O cliente valida o alvo antes de começar: só aceita HTTP local, sem caminho e sem credencial na URL.",
      en: "The client validates the target before starting: only local HTTP, with no path and no credentials in the URL.",
    },
    safety: {
      pt: [
        "O servidor recusa ser ligado fora do loopback e o cliente recusa alvos externos.",
        "Bloqueia HTTPS, credenciais na URL e endereços que não sejam da máquina local.",
        "Nenhum cookie, token, seletor real ou acesso a terceiros.",
        "Testes do comportamento HTTP, do progresso, da idempotência e dos limites de rede.",
      ],
      en: [
        "The server refuses non-loopback binding and the client refuses external targets.",
        "Blocks HTTPS, credentials in the URL and any address outside the local machine.",
        "No cookies, tokens, real selectors or third-party access.",
        "Tests for HTTP behavior, progress, idempotency and network boundaries.",
      ],
    },
    limits: {
      pt: ["Não é modelo de integração com portal real.", "Não faz login, controle de navegador nem raspagem de dados."],
      en: ["It is not an integration template for a real portal.", "It does no login, browser control or scraping."],
    },
  },
  {
    slug: "leadfinder",
    tests: 165, // cargo 156 + vitest 9
    status: { pt: "Ferramenta de uso próprio, versão 0.4.3", en: "In-house tool, version 0.4.3" },
    problem: {
      pt: "Para oferecer sites e automações a pequenos negócios, eu precisava de uma lista de estabelecimentos com contato e com sinais claros do que falta no digital de cada um. Não queria pagar por bases de leads nem raspar o Google Maps, então montei a ferramenta em cima de dados abertos.",
      en: "To offer websites and automation to small businesses, I needed a list of places with contact details and clear signs of what each one is missing online. I didn't want to pay for lead databases or scrape Google Maps, so I built the tool on open data.",
    },
    features: {
      pt: [
        "Descoberta por bairro e segmento no OpenStreetMap, com progresso real e opção de cancelar.",
        "Junta o mesmo estabelecimento vindo de buscas diferentes; quando a semelhança é incerta, manda para revisão manual em vez de unir sozinho.",
        "Verifica o site oficial (HTTPS, link de WhatsApp, página de contato) lendo poucas páginas por domínio e respeitando o robots.txt.",
        "Oportunidades geradas por regras fixas, cada uma com a evidência que usou e o grau de confiança.",
        "CRM com funil, filtros E/OU salvos, notas, histórico campo a campo e exportação em CSV.",
      ],
      en: [
        "Discovery by district and segment on OpenStreetMap, with real progress and a cancel option.",
        "Merges the same business found by different searches; when the match is uncertain, it goes to manual review instead of being merged automatically.",
        "Checks the official website (HTTPS, WhatsApp link, contact page) reading only a few pages per domain and respecting robots.txt.",
        "Opportunities come from fixed rules, each one showing the evidence it used and its confidence level.",
        "CRM with a pipeline, saved AND/OR filters, notes, field-by-field history and CSV export.",
      ],
    },
    flow: {
      pt: ["Interface React", "Comandos Tauri tipados", "Backend em Rust", "OpenStreetMap (Overpass)", "SQLite local"],
      en: ["React interface", "Typed Tauri commands", "Rust backend", "OpenStreetMap (Overpass)", "Local SQLite"],
    },
    flowNote: {
      pt: "A interface não acessa rede, arquivos nem SQL: ela só chama comandos que o backend lista um a um.",
      en: "The interface has no access to the network, files or SQL: it can only call commands the backend lists one by one.",
    },
    safety: {
      pt: [
        "Proteção contra SSRF no verificador de sites: bloqueia loopback, redes privadas e o endereço de metadados de nuvem, inclusive depois do DNS e em cada redirecionamento.",
        "Só http e https nas portas 80 e 443, com limite de tamanho e de tempo por página.",
        "Consultas ao servidor público do Overpass uma de cada vez, com intervalo mínimo e respeito a HTTP 429.",
        "Falha de rede nunca apaga dados, e o banco tem backup automático com verificação de integridade na restauração.",
      ],
      en: [
        "SSRF protection in the website checker: it blocks loopback, private networks and the cloud metadata address, including after DNS and on every redirect.",
        "Only http and https on ports 80 and 443, with size and time limits per page.",
        "Queries to the public Overpass server run one at a time, with a minimum interval and respect for HTTP 429.",
        "A network failure never deletes data, and the database has automatic backups with an integrity check on restore.",
      ],
    },
    limits: {
      pt: [
        "Só para Windows por enquanto.",
        "Depende do que está cadastrado no OpenStreetMap: muitos negócios aparecem sem telefone ou site.",
        "Não envia mensagens. O contato com cada empresa é feito por mim.",
      ],
      en: [
        "Windows only for now.",
        "It depends on what is mapped in OpenStreetMap: many businesses show up without a phone or website.",
        "It doesn't send messages. I contact each business myself.",
      ],
    },
  },
  {
    slug: "audit",
    tests: 401, // GitHub Actions, último commit da main (401 passaram, 4 ignorados)
    status: { pt: "Ferramenta de uso próprio, versão 0.1", en: "In-house tool, version 0.1" },
    problem: {
      pt: "Antes de falar de segurança com uma empresa, eu queria entender o que ela expõe na internet usando só fontes públicas. E, quando há autorização, conduzir o teste com escopo registrado, limites claros e evidência de tudo. Juntei as duas coisas num app local, sem IA e sem API paga.",
      en: "Before talking security with a company, I wanted to understand what it exposes online using only public sources. And when there is authorization, to run the test with a recorded scope, clear limits and evidence for everything. I put both in one local app, with no AI and no paid API.",
    },
    features: {
      pt: [
        "Pesquisa passiva de um domínio: DNS, registro (RDAP), certificados públicos (Certificate Transparency) e histórico do Internet Archive. Não acessa o site.",
        "Auditoria autorizada que orquestra httpx, Nmap e ffuf sob um orçamento único de requisições, com cada ferramenta registrada no resultado.",
        "Cruzamento das versões encontradas com CVEs na NVD, com prioridade por CVSS, EPSS e o catálogo CISA KEV, sem nenhuma requisição ao alvo.",
        "Importação de evidências do Nmap (XML), Nuclei (JSONL) e inventários CycloneDX.",
        "Relatórios executivos e técnicos em HTML e PDF, cada edição com hash SHA-256.",
      ],
      en: [
        "Passive domain research: DNS, registration (RDAP), public certificates (Certificate Transparency) and Internet Archive history. It doesn't touch the site.",
        "Authorized audit that runs httpx, Nmap and ffuf under one request budget, with every tool recorded in the result.",
        "Matching of the versions found against CVEs in the NVD, prioritized by CVSS, EPSS and the CISA KEV catalog, with no request to the target.",
        "Evidence import from Nmap (XML), Nuclei (JSONL) and CycloneDX inventories.",
        "Executive and technical reports in HTML and PDF, each edition with a SHA-256 hash.",
      ],
    },
    flow: {
      pt: ["Interface NiceGUI", "Registro de autorização e escopo", "Coletores e ferramentas", "Correlação e classificação", "SQLite e relatórios"],
      en: ["NiceGUI interface", "Authorization and scope record", "Collectors and tools", "Correlation and classification", "SQLite and reports"],
    },
    flowNote: {
      pt: "Roda no Windows e no Kali Linux. Tudo fica num banco local; as fontes públicas só são consultadas quando eu peço.",
      en: "Runs on Windows and Kali Linux. Everything stays in a local database; public sources are only queried when I ask.",
    },
    safety: {
      pt: [
        "Nada ativo sem um registro de autorização com escopo, exclusões, regras e janela de validade, conferido e confirmado antes de começar.",
        "Alvo fora do escopo é recusado, e a pesquisa passiva rejeita qualquer etapa ativa.",
        "Indício nunca vira \"vulnerabilidade confirmada\": correspondência de CVE por versão aparece como algo a validar.",
        "Relatórios gerados localmente em contexto offline, com scripts e requisições bloqueados, e testes de laboratório marcados como demonstração.",
      ],
      en: [
        "Nothing active runs without an authorization record with scope, exclusions, rules and a validity window, reviewed and confirmed first.",
        "Targets outside the scope are refused, and passive research rejects any active step.",
        "A lead never becomes a \"confirmed vulnerability\": a CVE match by version shows up as something to validate.",
        "Reports are generated locally in an offline context with scripts and requests blocked, and lab tests are marked as demos.",
      ],
    },
    limits: {
      pt: [
        "A aquisição contra origens externas ainda não foi homologada num domínio público. As telas aqui são do laboratório local.",
        "Versão lida em banner pode enganar: distribuições corrigem falhas sem mudar o número (backport).",
        "Interface só em português.",
      ],
      en: [
        "Acquisition against external origins hasn't been validated on a public domain yet. The screens here come from the local lab.",
        "A version read from a banner can mislead: distributions fix flaws without changing the number (backport).",
        "Interface in Portuguese only.",
      ],
    },
  },
];

export const CASE_UI: L<{
  back: string;
  problem: string;
  features: string;
  flow: string;
  safety: string;
  limits: string;
  run: string;
  tests: (n: number) => string;
  repo: string;
  next: string;
  viewCase: string;
  privateCode: string;
  privateNote: string;
  moreShots: string;
  desktopApp: string;
}> = {
  pt: {
    back: "Voltar aos projetos",
    problem: "O problema",
    features: "O que ele faz",
    flow: "Como foi construído",
    safety: "Testes e segurança",
    limits: "Limites conhecidos",
    run: "Para rodar localmente",
    tests: (n) => `${n} testes automatizados`,
    repo: "Código no GitHub",
    next: "Próximo projeto",
    viewCase: "Ver o case",
    privateCode: "Código privado",
    privateNote: "O código deste projeto não é público. Posso mostrar o funcionamento numa conversa.",
    moreShots: "Outras telas",
    desktopApp: "App desktop · Windows",
  },
  en: {
    back: "Back to projects",
    problem: "The problem",
    features: "What it does",
    flow: "How it's built",
    safety: "Tests and security",
    limits: "Known limits",
    run: "Run it locally",
    tests: (n) => `${n} automated tests`,
    repo: "Code on GitHub",
    next: "Next project",
    viewCase: "View the case",
    privateCode: "Private code",
    privateNote: "This project's code isn't public. I can walk you through it in a call.",
    moreShots: "More screens",
    desktopApp: "Desktop app · Windows",
  },
};
