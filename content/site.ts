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
      pt: "Versão pública de uma automação que fiz para a rotina de nutrição clínica do hospital onde trabalho. Ela organiza os casos por prioridade, registra cada execução e gera um relatório.",
      en: "Public version of an automation I built for the clinical nutrition routine at the hospital where I work. It sorts cases by priority, logs every run and generates a report.",
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
    galleryHeading: string;
    galleryHint: string;
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
      renderNote: "Cena 3D renderizada em tempo real no navegador.",
      incl: "Inclinação",
      dist: "Distância",
      scroll: "Role para ver mais",
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
      renderNote: "3D scene rendered live in the browser.",
      incl: "Inclination",
      dist: "Distance",
      scroll: "Scroll for more",
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
