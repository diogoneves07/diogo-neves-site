// Single source of truth for the home/landing content.
// Extracted from the real CV (public/Profile.pdf). Do not invent roles,
// companies or achievements — only the data below is authoritative.

export interface ResumeLink {
  label: string;
  href: string;
}

export interface Domain {
  icon: string;
  label: string;
}

export interface ProgrammingLanguage {
  name: string;
  color: string;
  icon: string;
}

export interface Country {
  flag: string;
  name: string;
}

export interface Flagship {
  name: string;
  note: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Experience {
  icon: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  highlights?: string[];
  stack?: string[];
  current?: boolean;
}

export interface Education {
  course: string;
  institution: string;
  period: string;
}


export const profile = {
  name: "Diogo Neves",
  kicker: "Desenvolvedor de Software · Salvador, BA",
  // The display headline is split so the accent word can be italicised.
  headlineLead: "Software que escala",
  headlineRest: "sob",
  headlineEmphasis: "pressão",
  description:
    "Desenvolvedor de Software com experiência em backend, frontend e mobile, " +
    "especializado em performance, processamento de grandes volumes de dados e " +
    "arquitetura de aplicações escaláveis.",
  email: "07dneves@gmail.com",
  phone: "+55 75 99843-1779",
  location: "Salvador, Bahia · Brasil",
};

export const links = {
  linkedin: "https://www.linkedin.com/in/diogoneves07/",
  github: "https://github.com/diogoneves07",
  devto: "https://dev.to/diogoneves07",
  resume: "/Profile.pdf",
  email: `mailto:${profile.email}`,
};

export const about = {
  title: "Software que escala sob pressão",
  lead:
    "Desenvolvedor de Software com mais de seis anos em frontend, backend e " +
    "mobile — especializado em performance, processamento de grandes volumes " +
    "de dados e arquitetura de aplicações escaláveis.",
  paragraphs: [
    "Construo interfaces complexas e otimizo fluxos críticos: integração com " +
      "APIs, processamento assíncrono, visualização de dados, mapas, relatórios " +
      "e formulários dinâmicos em aplicações que lidam com alto volume de " +
      "informação.",
    "Atuo também em liderança técnica — colaborando com clientes e times " +
      "multidisciplinares, definindo regras de negócio e puxando a melhoria " +
      "contínua dos produtos.",
  ],
  // Domínios extraídos do Resumo do CV (Profile.pdf).
  domains: [
    { icon: "☀️", label: "Inspeção de parques solares" },
    { icon: "🎓", label: "Educação pública" },
    { icon: "🌱", label: "Turismo sustentável" },
    { icon: "✈️", label: "Agenciamento de viagens" },
    { icon: "👁️", label: "Visão computacional" },
    { icon: "📊", label: "Dashboards em tempo real" },
    { icon: "🏢", label: "Aplicações corporativas" },
  ] satisfies Domain[],
  // Linguagens do CV com a cor de marca de cada uma.
  languages: [
    { name: "JavaScript", color: "#f7df1e", icon: "/icons/lang/javascript.svg" },
    { name: "TypeScript", color: "#3178c6", icon: "/icons/lang/typescript.svg" },
    { name: "Python", color: "#3776ab", icon: "/icons/lang/python.svg" },
    { name: "C#", color: "#9b4f96", icon: "/icons/lang/csharp.svg" },
    { name: "Dart", color: "#0175c2", icon: "/icons/lang/dart.svg" },
    { name: "PHP", color: "#787cb5", icon: "/icons/lang/php.svg" },
  ] satisfies ProgrammingLanguage[],
};

export const track = {
  countries: [
    { flag: "🇧🇷", name: "Brasil" },
    { flag: "🇵🇹", name: "Portugal" },
  ] satisfies Country[],
  flagships: [
    {
      name: "Inspeção de Parques Solares",
      note: "50 mil+ imagens · pipeline 5× mais rápido com Web Workers",
    },
    {
      name: "Educação Pública — Prefeitura (BA)",
      note: "Liderança de equipe front-end",
    },
    {
      name: "Monitur",
      note: "Sistema de Apoio à Decisão · turismo sustentável · em produção (PT)",
    },
    {
      name: "SIAV",
      note: "Agenciamento de viagens · Angular + C# (PT)",
    },
    {
      name: "Hive — Visão Computacional",
      note: "Dashboard em tempo real via WebSocket, com visão computacional processada no cliente",
    },
  ] satisfies Flagship[],
};

export const experienceIntro = {
  title: "Liderança técnica, throughput e produto em produção.",
  lead:
    "Seis anos entregando software que chega à produção — do Brasil a " +
    "Portugal, em times que liderei e em sistemas que precisavam aguentar " +
    "escala real.",
  signals: [
    { icon: "👥", label: "Liderança de times front-end" },
    { icon: "🌍", label: "Brasil & Portugal" },
    { icon: "🚀", label: "Sistemas em produção" },
    { icon: "⚡", label: "Performance & escala" },
  ] satisfies Domain[],
};

export const experiences: Experience[] = [
  {
    icon: "☀️",
    role: "Desenvolvedor Front-end Líder",
    company: "Marttech",
    period: "out 2024 — Presente",
    current: true,
    summary:
      "Liderança técnica do front-end em sistemas de inspeção de parques " +
      "solares — fluxos críticos com alto volume de dados, sem travar a " +
      "thread principal e com a RAM sob controle.",
    highlights: [
      "Pipeline paralelo com Web Workers: 50 mil+ imagens térmicas/RGB pareadas e enviadas ao Azure Blob, 5× mais rápido",
      "Migração de mapas Mapbox → Azure Maps com algoritmo próprio de coordenadas visíveis (menos custo, mais performance)",
      "Editor de imagens térmicas: seleção de áreas, medição de temperatura e registro de anomalias",
      "Liderança de equipe front-end em sistema de educação pública (prefeitura da Bahia)",
    ],
    stack: ["React", "TypeScript", "Web Workers", "Azure", "SignalR"],
  },
  {
    icon: "✈️",
    role: "Full-stack Developer",
    company: "Quantico Solutions",
    location: "Lisboa, Portugal",
    period: "abr 2023 — jul 2024",
    summary:
      "Contribuí em seis projetos de tamanhos variados, com forte colaboração " +
      "com o cliente na definição de regras de negócio.",
    highlights: [
      "SIAV — Sistema Integrado de Agenciamento de Viagens (Angular + C#)",
      "Monitur — Sistema de Apoio à Decisão para turismo sustentável, em produção (VueJS + Python)",
    ],
    stack: ["Angular", "C# · Blazor", "VueJS", "Python"],
  },
  {
    icon: "👁️",
    role: "Desenvolvedor Front-end",
    company: "Hive (COLMEIA Visão Computacional)",
    period: "fev 2022 — ago 2022",
    summary:
      "Dashboard em tempo real para dados coletados por inteligência " +
      "artificial, transmitidos via WebSocket e processados no cliente com " +
      "funções JavaScript próprias.",
    stack: ["Angular", "WebSocket", "Realtime"],
  },
  {
    icon: "🧩",
    role: "Full-stack Developer",
    company: "Freelance",
    period: "2018 — 2024",
    summary:
      "Aplicações completas de ponta a ponta — incluindo sistemas de " +
      "inventário — com bancos relacionais (MariaDB) e não relacionais " +
      "(MongoDB).",
    stack: ["Node.js", "MariaDB", "MongoDB"],
  },
];

export const education: Education[] = [
  {
    course: "Técnico em Informática",
    institution: "IFBA — Instituto Federal da Bahia",
    period: "2017 — 2019 · Formação",
  },
];

export const stackGroups: SkillGroup[] = [
  {
    category: "Linguagens de programação",
    items: ["JavaScript", "TypeScript", "Dart", "Python", "C#", "PHP"],
  },
  {
    category: "Frameworks e bibliotecas",
    items: [
      "React.js",
      "Next.js",
      "Angular",
      "Vue.js",
      "React Native",
      "Node.js",
      "Flutter",
      "Blazor",
    ],
  },
  {
    category: "Bancos de dados",
    items: ["MySQL", "PostgreSQL", "MongoDB", "MariaDB"],
  },
  {
    category: "Infraestrutura, DevOps e ferramentas",
    items: [
      "Docker",
      "Docker Compose",
      "GitHub Actions",
      "Redis",
      "Azure DevOps",
      "GitHub",
      "GitLab",
      "Jira",
      "Vite",
      "Vitest",
      "Jest",
      "Playwright",
    ],
  },
  {
    category: "Cloud e produtos",
    items: [
      "AWS S3",
      "Azure Blob Storage",
      "Azure Maps",
      "Azure DevOps",
      "DevExpress",
    ],
  },
  {
    category: "Padrões, arquitetura e boas práticas",
    items: [
      "Spec-Driven Development",
      "TDD",
      "DDD",
      "SOLID",
      "Clean Code",
      "Clean Architecture",
      "DRY",
      "KISS",
      "YAGNI",
      "Design System",
      "Atomic Design",
      "RESTful APIs",
      "Repository Pattern",
      "Unit of Work",
      "Dependency Injection",
      "Event-Driven Architecture",
      "Domain Events",
      "Microservices",
      "CI/CD",
      "versionamento com Git",
    ],
  },
];

export const languages: Language[] = [
  { name: "Português", level: "Nativo" },
  { name: "Inglês", level: "Profissional limitado" },
];

export interface Language {
  name: string;
  level: string;
}
