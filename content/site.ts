// Conteúdo do site em português e inglês.
// Fonte dos fatos: READMEs dos repositórios públicos de João Morais (auditados em
// 2026-11-20) e o conteúdo já publicado no portfólio anterior. Nada aqui é
// métrica inventada; onde o projeto é demonstração, isso está dito.
// Tom: primeira pessoa, frases curtas e diretas, sem slogans.

export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

export const LINKS = {
  github: "https://github.com/JoaoMorais-stack",
  pentestLabs: "https://github.com/JoaoMorais-stack/pentest-labs",
  linkedin: "https://www.linkedin.com/in/joaomorais-infosec/",
  email: "vitor.infosec@gmail.com",
} as const;

export type Project = {
  slug: string;
  name: string;
  repo?: string; // ausente = código privado
  shot: string; // prefixo das capturas em /media/projects
  desktopOnly?: boolean; // app sem versão de celular: sem captura mobile
  extraShots?: { id: string; alt: Record<Locale, string> }[]; // telas adicionais na página de case
  stack: string[];
  kind: Record<Locale, string>;
  summary: Record<Locale, string>;
  note: Record<Locale, string>;
};

export const PROJECTS: Project[] = [
  {
    slug: "ebinex",
    name: "Ebinex",
    repo: "https://github.com/JoaoMorais-stack/ebinex-platform",
    shot: "ebinex",
    stack: ["Node.js", "JavaScript", "Canvas", "node:test"],
    kind: { pt: "Aplicação full stack", en: "Full-stack application" },
    summary: {
      pt: "Simulador de investimentos com mercados fictícios. Dá para comprar e vender ativos com saldo virtual, acompanhar a carteira e consultar o histórico. Escrevi em Node.js sem bibliotecas externas e cobri as regras com 11 testes automatizados.",
      en: "Investment simulator with fictional markets. You can buy and sell assets with a virtual balance, follow the portfolio and check the history. I wrote it in Node.js with no external libraries and covered the rules with 11 automated tests.",
    },
    note: {
      pt: "Projeto de demonstração. Nenhum dado é real.",
      en: "Demo project. None of the data is real.",
    },
  },
  {
    slug: "clinical",
    name: "Clinical Nutrition Automation",
    repo: "https://github.com/JoaoMorais-stack/clinical-nutrition-automation-demo",
    shot: "clinical",
    stack: ["Python", "SQLite", "HTTP local", "unittest"],
    kind: { pt: "Automação de processos", en: "Process automation" },
    summary: {
      pt: "Demonstração pública do tipo de automação que faço no hospital onde trabalho. Organiza casos de nutrição fictícios por prioridade, registra cada execução e gera um relatório.",
      en: "Public demo of the kind of automation I build at the hospital where I work. It sorts fictional nutrition cases by priority, logs every run and generates a report.",
    },
    note: {
      pt: "Casos fictícios. Não há dado de paciente.",
      en: "Fictional cases. No patient data.",
    },
  },
  {
    slug: "workforce",
    name: "Workforce Management",
    repo: "https://github.com/JoaoMorais-stack/workforce-management-demo",
    shot: "workforce",
    stack: ["Python", "SQLite", "API JSON", "JavaScript"],
    kind: { pt: "Aplicação web", en: "Web application" },
    summary: {
      pt: "Cadastro de equipe com carga horária semanal, férias e afastamentos, além de busca e filtros. Usei só a biblioteca padrão do Python e SQLite.",
      en: "Team directory with weekly hours, vacations and leave, plus search and filters. Built with the Python standard library and SQLite only.",
    },
    note: {
      pt: "Pessoas fictícias.",
      en: "Fictional people.",
    },
  },
  {
    slug: "shift",
    name: "Gerador de Escalas",
    repo: "https://github.com/JoaoMorais-stack/shift-schedule-generator",
    shot: "shift",
    stack: ["Python", "SQLite", "HTML", "JavaScript"],
    kind: { pt: "Regras de escala", en: "Scheduling rules" },
    summary: {
      pt: "Monta escalas de fim de semana e feriado respeitando o rodízio, as férias e quem não pode trabalhar em cada data. Quando a escala é refeita, os ajustes feitos à mão continuam lá.",
      en: "Builds weekend and holiday rosters that follow the rotation, vacations and who can't work on each date. When the roster is rebuilt, manual changes are kept.",
    },
    note: {
      pt: "Dados de exemplo.",
      en: "Sample data.",
    },
  },
  {
    slug: "student",
    name: "Student Portal Automation",
    repo: "https://github.com/JoaoMorais-stack/student-portal-automation-demo",
    shot: "student",
    stack: ["Python", "urllib", "HTTP local", "unittest"],
    kind: { pt: "Automação com trava de segurança", en: "Automation with a safety lock" },
    summary: {
      pt: "Automatiza tarefas repetitivas de um portal acadêmico simulado. O código recusa qualquer endereço fora do computador local, para que não possa ser usado contra um sistema real.",
      en: "Automates repetitive tasks on a simulated academic portal. The code refuses any address outside the local machine, so it can't be pointed at a real system.",
    },
    note: {
      pt: "Portal simulado. Só roda localmente.",
      en: "Simulated portal. Runs locally only.",
    },
  },
  {
    slug: "leadfinder",
    name: "MoraisSec LeadFinder",
    shot: "leadfinder",
    desktopOnly: true,
    stack: ["Tauri 2", "Rust", "React", "TypeScript", "SQLite"],
    kind: { pt: "App desktop de prospecção", en: "Desktop prospecting app" },
    summary: {
      pt: "Aplicativo para Windows que encontra estabelecimentos no OpenStreetMap, junta cadastros duplicados, verifica os sites e aponta o que falta no digital de cada negócio, com regras que explicam o motivo. Tem um CRM simples e guarda tudo num banco local.",
      en: "Windows app that finds businesses on OpenStreetMap, merges duplicate records, checks their websites and points out what each business is missing online, with rules that explain why. It has a simple CRM and keeps everything in a local database.",
    },
    note: {
      pt: "As telas usam empresas fictícias.",
      en: "The screens use fictional businesses.",
    },
    extraShots: [
      { id: "company", alt: { pt: "Ficha de uma empresa fictícia com canais de contato e oportunidades.", en: "Record of a fictional business with contact channels and opportunities." } },
      { id: "explore", alt: { pt: "Lista de empresas fictícias a prospectar, com contatos e prioridade.", en: "List of fictional businesses to prospect, with contacts and priority." } },
      { id: "opportunities", alt: { pt: "Regras de oportunidade com grau de confiança e quantidade aberta.", en: "Opportunity rules with confidence level and open count." } },
    ],
  },
];

export type Dictionary = {
  meta: { title: string; description: string };
  nav: { work: string; security: string; about: string; contact: string; menu: string; close: string; switchTo: string; switchLabel: string };
  hero: {
    first: string;
    last: string;
    disciplines: string[];
    lede: string;
    ctaWork: string;
    ctaContact: string;
    scroll: string;
    map: {
      note: string;
      request: string;
      layers: { ui: string; api: string; db: string; infra: string; auto: string };
      phases: { build: string; scan: string; finding: string; fix: string; calm: string };
    };
  };
  intro: {
    statement: string;
    items: { title: string; status: string; body: string }[];
  };
  work: {
    heading: string;
    lede: string;
    featuredKind: string;
    repo: string;
    galleryHeading: string;
    galleryHint: string;
  };
  security: {
    heading: string;
    lede: string;
    methodHeading: string;
    steps: { title: string; body: string }[];
    practiceHeading: string;
    practice: { name: string; body: string }[];
    toolsHeading: string;
    tools: string[];
    notesHeading: string;
    notes: string;
    certHeading: string;
    certs: { name: string; status: string }[];
    certNote: string;
    repoLink: string;
  };
  about: {
    heading: string;
    body: string[];
    photoAlt: string;
  };
  contact: {
    heading: string;
    body: string;
    email: string;
    linkedin: string;
    github: string;
  };
  footer: string;
  skip: string;
};

export const DICT: Record<Locale, Dictionary> = {
  pt: {
    meta: {
      title: "João Morais | Desenvolvedor e pentester em formação",
      description:
        "Sou desenvolvedor e estudo segurança ofensiva em São Paulo. Aqui estão meus projetos de software e automação e o que venho estudando em pentest.",
    },
    nav: {
      work: "Projetos",
      security: "Segurança",
      about: "Sobre",
      contact: "Contato",
      menu: "Menu",
      close: "Fechar",
      switchTo: "EN",
      switchLabel: "Read in English",
    },
    hero: {
      first: "João",
      last: "Morais",
      disciplines: ["Desenvolvedor de software", "e pentester em formação"],
      lede: "Faço sistemas web, aplicativos e automações. Estudo pentest em laboratórios autorizados. Moro em São Paulo.",
      ctaWork: "Ver projetos",
      ctaContact: "Contato",
      scroll: "Role para ver mais",
      map: {
        note: "Ilustração de como eu construo e testo um sistema.",
        request: "GET /api/contas/1042",
        layers: { ui: "Interface", api: "API", db: "Banco de dados", infra: "Servidor", auto: "Automações" },
        phases: {
          build: "Montando o sistema",
          scan: "Varrendo a camada {layer}",
          finding: "Falha: a API entrega a conta de outro usuário",
          fix: "Corrigido: a mesma requisição agora é negada",
          calm: "Sistema em funcionamento",
        },
      },
    },
    intro: {
      statement:
        "Comecei a programar para resolver problemas do meu próprio trabalho, no hospital. Hoje desenvolvo sistemas e automações e estudo pentest para entender como eles podem ser atacados.",
      items: [
        {
          title: "Segurança ofensiva",
          status: "Em formação",
          body: "Faço laboratórios no TryHackMe e no Hack The Box e o curso de pentest da Solyd. Meu foco é teste de aplicações web, seguindo o OWASP.",
        },
        {
          title: "Desenvolvimento",
          status: "Projetos no GitHub",
          body: "Aplicações web em Python e Node.js e um app em React Native. Os projetos web têm testes automatizados.",
        },
        {
          title: "Automação",
          status: "Em uso no trabalho",
          body: "Automatizei rotinas do hospital, como juntar dados do sistema com as planilhas do setor. Uma versão sem dados reais está nos projetos.",
        },
      ],
    },
    work: {
      heading: "Projetos",
      lede: "Todos estão no meu GitHub. As imagens são das aplicações rodando no meu computador, com dados fictícios.",
      featuredKind: "Destaque",
      repo: "Código no GitHub",
      galleryHeading: "Outros projetos",
      galleryHint: "Toque ou passe o mouse para abrir.",
    },
    security: {
      heading: "Segurança ofensiva",
      lede: "Ainda não trabalho como pentester. Estou me preparando com laboratórios e sigo o mesmo método em todo exercício, documentado no meu GitHub.",
      methodHeading: "Como eu conduzo um teste",
      steps: [
        {
          title: "Autorização e escopo",
          body: "Antes de qualquer ferramenta, registro quem autorizou, o que pode ser testado, o horário e o que é proibido. Sem autorização, não há teste.",
        },
        {
          title: "Mapeamento",
          body: "Identifico os serviços expostos e os limites da aplicação dentro do escopo aprovado.",
        },
        {
          title: "Hipótese e validação",
          body: "Formulo uma hipótese de falha e confirmo com o método menos invasivo possível, guardando só a evidência necessária.",
        },
        {
          title: "Comunicação do risco",
          body: "Descrevo o componente afetado e o impacto real, separo fato de suposição e proponho a correção e como retestar.",
        },
        {
          title: "Revisão antes de publicar",
          body: "Troco dados do alvo por marcadores e removo segredos, dados pessoais e flags antes de qualquer publicação.",
        },
      ],
      practiceHeading: "Onde eu pratico",
      practice: [
        { name: "Solyd", body: "Curso de pentest com prática orientada." },
        { name: "TryHackMe", body: "Trilhas e laboratórios guiados." },
        { name: "Hack The Box", body: "Máquinas e desafios autorizados." },
      ],
      toolsHeading: "Ferramentas que uso nos laboratórios",
      tools: ["Burp Suite", "OWASP ZAP", "Nuclei", "SQLMap", "Wfuzz", "Subfinder", "HTTPX", "Kali Linux"],
      notesHeading: "Anotações",
      notes: "Organizo o que estudo num cofre de notas no Obsidian: OWASP Top 10, XSS, SQLi, IDOR, LFI, RCE, além de redes, DNS e Linux.",
      certHeading: "Certificações",
      certs: [
        { name: "eJPT", status: "Em preparação" },
        { name: "OSCP", status: "Objetivo a longo prazo" },
      ],
      certNote: "Nenhuma concluída ainda. Atualizo aqui quando passar na prova.",
      repoLink: "Metodologia e modelos de relatório no GitHub",
    },
    about: {
      heading: "Sobre",
      body: [
        "Sou Cabo da Força Aérea Brasileira e trabalho no Hospital de Força Aérea de São Paulo desde 2022. Foi lá que comecei a automatizar tarefas repetitivas do meu setor.",
        "Curso Tecnólogo em Cyber Segurança na Anhanguera, com conclusão prevista para 2028, e estudo pentest nas horas vagas. Quero trabalhar com testes de intrusão sem deixar de desenvolver as minhas próprias ferramentas.",
      ],
      photoAlt: "Retrato de João Morais de terno cinza e gravata vermelha.",
    },
    contact: {
      heading: "Contato",
      body: "Estou disponível para projetos de desenvolvimento e automação e para vagas em segurança ofensiva. O jeito mais rápido de falar comigo é por e-mail ou pelo LinkedIn.",
      email: "E-mail",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    footer: "João Morais",
    skip: "Pular para o conteúdo",
  },
  en: {
    meta: {
      title: "João Morais | Developer and pentester in training",
      description:
        "I'm a developer studying offensive security in São Paulo, Brazil. Here are my software and automation projects and what I've been studying in pentesting.",
    },
    nav: {
      work: "Projects",
      security: "Security",
      about: "About",
      contact: "Contact",
      menu: "Menu",
      close: "Close",
      switchTo: "PT",
      switchLabel: "Ler em português",
    },
    hero: {
      first: "João",
      last: "Morais",
      disciplines: ["Software developer", "and pentester in training"],
      lede: "I build web systems, apps and automations. I study pentesting in authorized labs. I live in São Paulo, Brazil.",
      ctaWork: "View projects",
      ctaContact: "Contact",
      scroll: "Scroll for more",
      map: {
        note: "An illustration of how I build and test a system.",
        request: "GET /api/accounts/1042",
        layers: { ui: "Interface", api: "API", db: "Database", infra: "Server", auto: "Automations" },
        phases: {
          build: "Building the system",
          scan: "Scanning the {layer} layer",
          finding: "Flaw: the API returns another user's account",
          fix: "Fixed: the same request is now denied",
          calm: "System running",
        },
      },
    },
    intro: {
      statement:
        "I started programming to fix problems in my own job, at a hospital. Today I build systems and automations, and I study pentesting to understand how they can be attacked.",
      items: [
        {
          title: "Offensive security",
          status: "In training",
          body: "I work through labs on TryHackMe and Hack The Box and take the Solyd pentest course. My focus is web application testing, following OWASP.",
        },
        {
          title: "Development",
          status: "Projects on GitHub",
          body: "Web applications in Python and Node.js and an app in React Native. The web projects have automated tests.",
        },
        {
          title: "Automation",
          status: "Used at work",
          body: "I automated routines at the hospital, such as merging data from the system with the team's spreadsheets. A version without real data is in the projects.",
        },
      ],
    },
    work: {
      heading: "Projects",
      lede: "All of them are on my GitHub. The images show the apps running on my computer with fictional data.",
      featuredKind: "Featured",
      repo: "Code on GitHub",
      galleryHeading: "More projects",
      galleryHint: "Tap or hover to open.",
    },
    security: {
      heading: "Offensive security",
      lede: "I don't work as a pentester yet. I'm preparing through labs and follow the same method in every exercise, documented on my GitHub.",
      methodHeading: "How I run a test",
      steps: [
        {
          title: "Authorization and scope",
          body: "Before any tool, I record who authorized it, what can be tested, the time window and what is off-limits. No authorization, no test.",
        },
        {
          title: "Mapping",
          body: "I identify exposed services and the application's boundaries inside the approved scope.",
        },
        {
          title: "Hypothesis and validation",
          body: "I form a hypothesis about a flaw and confirm it with the least invasive method available, keeping only the evidence I need.",
        },
        {
          title: "Communicating risk",
          body: "I describe the affected component and the real impact, separate facts from assumptions, and propose the fix and how to retest it.",
        },
        {
          title: "Review before publishing",
          body: "I replace target details with placeholders and remove secrets, personal data and flags before anything is published.",
        },
      ],
      practiceHeading: "Where I practice",
      practice: [
        { name: "Solyd", body: "Pentest course with guided practice." },
        { name: "TryHackMe", body: "Learning paths and guided labs." },
        { name: "Hack The Box", body: "Authorized machines and challenges." },
      ],
      toolsHeading: "Tools I use in the labs",
      tools: ["Burp Suite", "OWASP ZAP", "Nuclei", "SQLMap", "Wfuzz", "Subfinder", "HTTPX", "Kali Linux"],
      notesHeading: "Notes",
      notes: "I keep what I study in an Obsidian vault: OWASP Top 10, XSS, SQLi, IDOR, LFI, RCE, plus networking, DNS and Linux.",
      certHeading: "Certifications",
      certs: [
        { name: "eJPT", status: "Preparing" },
        { name: "OSCP", status: "Long-term goal" },
      ],
      certNote: "None completed yet. I'll update this when I pass the exam.",
      repoLink: "Methodology and report templates on GitHub",
    },
    about: {
      heading: "About",
      body: [
        "I'm a Corporal in the Brazilian Air Force and have worked at the São Paulo Air Force Hospital since 2022. That's where I started automating repetitive tasks in my department.",
        "I'm studying for a technology degree in Cyber Security at Anhanguera, expected in 2028, and I study pentesting in my spare time. I want to work in penetration testing and keep building my own tools.",
      ],
      photoAlt: "Portrait of João Morais in a grey suit and red tie.",
    },
    contact: {
      heading: "Contact",
      body: "I'm available for development and automation projects and for offensive security roles. The fastest way to reach me is email or LinkedIn.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    footer: "João Morais",
    skip: "Skip to content",
  },
};
