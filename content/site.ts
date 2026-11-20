// Conteúdo do site em português e inglês.
// Fonte dos fatos: READMEs dos repositórios públicos de João Morais (auditados em
// 2026-11-20) e o conteúdo já publicado no portfólio anterior. Nada aqui é
// métrica inventada; onde o projeto é demonstração, isso está dito.

export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

export const LINKS = {
  github: "https://github.com/JoaoMorais-stack",
  linkedin: "https://www.linkedin.com/in/joaomorais-infosec/",
  email: "vitor.infosec@gmail.com",
} as const;

export type Project = {
  slug: string;
  name: string;
  repo: string;
  shot: string; // prefixo das capturas em /media/projects
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
    kind: { pt: "Engenharia full stack", en: "Full-stack engineering" },
    summary: {
      pt: "Plataforma de paper trading com seis cenários de mercado fictícios, compra e venda com regras determinísticas, persistência local e testes de domínio, HTTP e limites de segurança.",
      en: "Paper-trading platform with six fictional market scenarios, deterministic buy and sell rules, local persistence and tests for domain, HTTP and security boundaries.",
    },
    note: {
      pt: "Demonstração local. Mercados e saldos são fictícios.",
      en: "Local demonstration. Markets and balances are fictional.",
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
      pt: "Versão pública e sanitizada de uma automação criada para a rotina de um hospital: organiza casos em uma fila de revisão priorizada, registra cada execução e gera relatório.",
      en: "Public, sanitized version of an automation built for a hospital routine: turns cases into a prioritized review queue, records every run and exports a report.",
    },
    note: {
      pt: "Todos os casos são sintéticos. Nenhum dado hospitalar real.",
      en: "Every case is synthetic. No real hospital data.",
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
      pt: "Diretório de equipe com capacidade semanal, ausências planejadas, filtros e uma API JSON validada, usando só a biblioteca padrão do Python.",
      en: "Team directory with weekly capacity, planned time off, filters and a validated JSON API, built on the Python standard library alone.",
    },
    note: {
      pt: "Pessoas e departamentos fictícios.",
      en: "Fictional people and departments.",
    },
  },
  {
    slug: "shift",
    name: "Gerador de Escalas",
    repo: "https://github.com/JoaoMorais-stack/shift-schedule-generator",
    shot: "shift",
    stack: ["Python", "SQLite", "HTML", "JavaScript"],
    kind: { pt: "Regras operacionais", en: "Operational rules" },
    summary: {
      pt: "Gera escalas de fim de semana e feriados respeitando rotação, férias e impedimentos, e preserva os ajustes manuais ao completar períodos.",
      en: "Builds weekend and holiday rosters that respect rotation, leave and unavailability, keeping manual edits when filling a period.",
    },
    note: {
      pt: "Registros de demonstração fictícios.",
      en: "Fictional demonstration records.",
    },
  },
  {
    slug: "student",
    name: "Student Portal Automation",
    repo: "https://github.com/JoaoMorais-stack/student-portal-automation-demo",
    shot: "student",
    stack: ["Python", "urllib", "HTTP local", "unittest"],
    kind: { pt: "Automação defensiva", en: "Defensive automation" },
    summary: {
      pt: "Automatiza um fluxo acadêmico repetitivo contra um portal simulado e bloqueia, no código, qualquer alvo fora da máquina local.",
      en: "Automates a repetitive academic flow against a mock portal and blocks, in code, any target outside the local machine.",
    },
    note: {
      pt: "Portal simulado. Execução apenas local.",
      en: "Mock portal. Runs locally only.",
    },
  },
];

export type Dictionary = {
  meta: { title: string; description: string };
  nav: { work: string; about: string; contact: string; menu: string; close: string; switchTo: string; switchLabel: string };
  hero: {
    first: string;
    last: string;
    disciplines: string[];
    lede: string;
    ctaWork: string;
    ctaContact: string;
    renderNote: string;
    incl: string;
    dist: string;
    scroll: string;
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
    captured: string;
    galleryHeading: string;
    galleryHint: string;
    openProject: string;
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
      title: "João Morais — cibersegurança, software e automação",
      description:
        "Portfólio de João Morais: aplicações web e mobile com testes, automação de processos e prática de segurança ofensiva em ambientes autorizados. São Paulo, Brasil.",
    },
    nav: {
      work: "Projetos",
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
      disciplines: ["Cibersegurança.", "Software.", "Automação."],
      lede: "Desenvolvo aplicações e automações com testes, e pratico segurança ofensiva em ambientes autorizados. São Paulo, Brasil.",
      ctaWork: "Ver projetos",
      ctaContact: "Falar comigo",
      renderNote: "Renderizado em tempo real: cada pixel segue um raio de luz curvado pela gravidade.",
      incl: "Inclinação",
      dist: "Distância",
      scroll: "Role para explorar",
    },
    intro: {
      statement:
        "Escrevo software que tira trabalho repetitivo das pessoas e estudo segurança ofensiva para entender como esse mesmo software pode falhar.",
      items: [
        {
          title: "Segurança ofensiva",
          status: "Em formação",
          body: "Laboratórios autorizados no TryHackMe, Hack The Box e no curso da Solyd, com metodologia OWASP e relatórios baseados em evidência.",
        },
        {
          title: "Software",
          status: "Projetos publicados",
          body: "Aplicações web e mobile com testes automatizados em Python, TypeScript, Node.js e React Native.",
        },
        {
          title: "Automação",
          status: "Uso real",
          body: "Rotinas operacionais transformadas em fluxos auditáveis, a partir de problemas vividos no dia a dia de um hospital.",
        },
      ],
    },
    work: {
      heading: "Projetos",
      lede: "Software que roda. Cada tela abaixo foi capturada do projeto executando localmente.",
      featuredKind: "Projeto em destaque",
      repo: "Ver código no GitHub",
      captured: "Captura real do app rodando em 127.0.0.1",
      galleryHeading: "Mais projetos",
      galleryHint: "Passe o cursor, toque ou use as setas para abrir cada projeto.",
      openProject: "Abrir",
    },
    about: {
      heading: "Sobre",
      body: [
        "Sou Cabo da Força Aérea Brasileira e trabalho no Hospital de Força Aérea de São Paulo desde 2022. A rotina exige método, atenção a dados e consistência, e foi dela que vieram minhas primeiras automações.",
        "Curso Tecnólogo em Cyber Segurança na Anhanguera, com conclusão prevista para 2028, e estudo pentest em laboratórios autorizados. Programação e automação são o que me deixam investigar, testar e documentar melhor.",
      ],
      photoAlt: "Retrato de João Morais de terno cinza e gravata vermelha.",
    },
    contact: {
      heading: "Vamos conversar.",
      body: "Estou aberto a projetos de software e automação e a oportunidades em segurança ofensiva.",
      email: "Enviar e-mail",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    footer: "João Morais. Site estático, sem rastreadores.",
    skip: "Pular para o conteúdo",
  },
  en: {
    meta: {
      title: "João Morais — cybersecurity, software and automation",
      description:
        "Portfolio of João Morais: tested web and mobile applications, process automation and offensive security practice in authorized environments. São Paulo, Brazil.",
    },
    nav: {
      work: "Work",
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
      disciplines: ["Cybersecurity.", "Software.", "Automation."],
      lede: "I build tested applications and automations, and practice offensive security in authorized environments. São Paulo, Brazil.",
      ctaWork: "See the work",
      ctaContact: "Get in touch",
      renderNote: "Rendered in real time: every pixel follows a ray of light bent by gravity.",
      incl: "Inclination",
      dist: "Distance",
      scroll: "Scroll to explore",
    },
    intro: {
      statement:
        "I write software that takes repetitive work off people's hands, and I study offensive security to understand how that same software can fail.",
      items: [
        {
          title: "Offensive security",
          status: "In training",
          body: "Authorized labs on TryHackMe, Hack The Box and the Solyd course, with OWASP methodology and evidence-based reports.",
        },
        {
          title: "Software",
          status: "Published projects",
          body: "Web and mobile applications with automated tests in Python, TypeScript, Node.js and React Native.",
        },
        {
          title: "Automation",
          status: "Real use",
          body: "Operational routines turned into auditable workflows, born from day-to-day problems inside a hospital.",
        },
      ],
    },
    work: {
      heading: "Work",
      lede: "Software that runs. Every screen below was captured from the project running locally.",
      featuredKind: "Featured project",
      repo: "View code on GitHub",
      captured: "Real capture of the app running on 127.0.0.1",
      galleryHeading: "More projects",
      galleryHint: "Hover, tap or use the arrow keys to open each project.",
      openProject: "Open",
    },
    about: {
      heading: "About",
      body: [
        "I am a Corporal in the Brazilian Air Force and have worked at the São Paulo Air Force Hospital since 2022. The job demands method, care with data and consistency, and it is where my first automations came from.",
        "I am studying for a technology degree in Cyber Security at Anhanguera, expected in 2028, and practice pentesting in authorized labs. Programming and automation are what let me investigate, test and document better.",
      ],
      photoAlt: "Portrait of João Morais in a grey suit and red tie.",
    },
    contact: {
      heading: "Let's talk.",
      body: "I am open to software and automation projects and to opportunities in offensive security.",
      email: "Send an email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    footer: "João Morais. Static site, no trackers.",
    skip: "Skip to content",
  },
};
