// Registro central tech → ícone para os chips de stack/tags.
// Logos de marca (devicon) ficam em public/icons/tech; tecnologias sem logo
// oficial (Web Workers, SignalR, WebSocket...) caem num emoji representativo.

export type TechIcon =
  | { kind: "svg"; src: string }
  | { kind: "emoji"; char: string };

const svg = (slug: string): TechIcon => ({
  kind: "svg",
  src: `/icons/tech/${slug}.svg`,
});
const langSvg = (slug: string): TechIcon => ({
  kind: "svg",
  src: `/icons/lang/${slug}.svg`,
});
const emoji = (char: string): TechIcon => ({ kind: "emoji", char });

// Chave = rótulo exato usado no resume.ts.
const REGISTRY: Record<string, TechIcon> = {
  React: svg("react"),
  "React.js": svg("react"),
  "React Native": svg("react"),
  TypeScript: svg("typescript"),
  Angular: svg("angular"),
  VueJS: svg("vuejs"),
  "Vue.js": svg("vuejs"),
  Python: svg("python"),
  "Node.js": svg("nodejs"),
  "C#": svg("csharp"),
  "C# · Blazor": svg("csharp"),
  Blazor: svg("csharp"),
  MongoDB: svg("mongodb"),
  MariaDB: svg("mariadb"),
  Vite: svg("vitejs"),
  Vitest: svg("vitejs"),
  Tailwind: svg("tailwindcss"),
  "Styled Components": svg("styledcomponents"),
  AWS: svg("amazonwebservices"),
  "AWS S3": svg("amazonwebservices"),
  Playwright: svg("playwright"),
  ChartJS: svg("chartjs"),
  Azure: svg("azure"),
  "Azure Blob": svg("azure"),
  "Azure Blob Storage": svg("azure"),
  "Azure Maps": svg("azure"),
  "Azure DevOps": svg("azure"),
  "Azure (Blob · Maps · DevOps)": svg("azure"),
  // Linguagens com logo dedicado em /icons/lang.
  JavaScript: langSvg("javascript"),
  Dart: langSvg("dart"),
  PHP: langSvg("php"),
  // Sem logo de marca → emoji representativo.
  "Next.js": emoji("▲"),
  Flutter: emoji("📱"),
  MySQL: emoji("🐬"),
  PostgreSQL: emoji("🐘"),
  Docker: emoji("🐳"),
  "Docker Compose": emoji("🐳"),
  "GitHub Actions": emoji("⚙️"),
  Redis: emoji("🔴"),
  GitHub: emoji("🐙"),
  GitLab: emoji("🦊"),
  Jira: emoji("📋"),
  Jest: emoji("🃏"),
  DevExpress: emoji("🧩"),
  "Web Workers": emoji("⚙️"),
  SignalR: emoji("📡"),
  WebSocket: emoji("🔌"),
  Realtime: emoji("⚡"),
  Performance: emoji("⚡"),
  Canvas: emoji("🎨"),
  Zod: emoji("🛡️"),
  // Padrões, arquitetura e boas práticas (conceitos, sem logo).
  "Spec-Driven Development": emoji("📝"),
  TDD: emoji("✅"),
  DDD: emoji("🧭"),
  SOLID: emoji("🧱"),
  "Clean Code": emoji("🧼"),
  "Clean Architecture": emoji("🏛️"),
  DRY: emoji("♻️"),
  KISS: emoji("🎯"),
  YAGNI: emoji("✂️"),
  "Design System": emoji("🎨"),
  "Atomic Design": emoji("⚛️"),
  "RESTful APIs": emoji("🔗"),
  "Repository Pattern": emoji("🗄️"),
  "Unit of Work": emoji("🔁"),
  "Dependency Injection": emoji("💉"),
  "Event-Driven Architecture": emoji("📡"),
  "Domain Events": emoji("📨"),
  Microservices: emoji("🧬"),
  "CI/CD": emoji("🔄"),
  "versionamento com Git": emoji("🌿"),
  // Tags de artigos sem logo de marca.
  UI: emoji("🎨"),
  Biblioteca: emoji("📚"),
  Jogo: emoji("🎮"),
  Animação: emoji("✨"),
  Carreira: emoji("📈"),
  IA: emoji("🤖"),
};

const FALLBACK: TechIcon = emoji("•");

export function techIcon(label: string): TechIcon {
  return REGISTRY[label] ?? FALLBACK;
}
