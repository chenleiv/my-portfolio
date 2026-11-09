const memoryImg = "/assets/img/memory.webp";
const signalForge = "/assets/img/signal.webp";

const aiWorkerSpaceImg = "/assets/img/insight-desk.webp";

type ProjectEra = "latest" | "older";

export interface Project {
  readonly label: number;
  readonly header: string;
  readonly subHeader: string;
  readonly img: string;
  readonly skills: readonly string[];
  readonly web?: string;
  readonly github: string;
  readonly swagger?: string;
  readonly hideWeb?: boolean;
  readonly hideGithub?: boolean;
  readonly era?: ProjectEra;
}

export const PROJECTS: readonly Project[] = [
  {
    label: 1,
    header: "InsightDesk — AI Document Workspace",
    subHeader:
      "My flagship project: a full-stack document workspace with an AI assistant (RAG) that answers from your own documents and verifies every citation. Built end to end with a React frontend, Node.js backend and MongoDB, local embeddings for retrieval, over 1,400 automated tests, CI with CodeQL, and an evaluation suite. Security built in: CSP and secure cookies, hardened file uploads with isolated parsing, server-side session revocation, rate limits and daily per-user question limits. Live demo, no sign-up needed.",
    img: aiWorkerSpaceImg,
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "RAG",
      "CodeQL",
      "Zod",
      "TanStack Query",
      "Groq",
    ],
    web: "https://insight-desk-bwji.onrender.com/",
    github: "https://github.com/chenleiv/insight-desk",
    era: "latest",
  },
  {
    label: 2,
    header: "SignalForge — Security Operations Platform",
    subHeader:
      "Full-stack project, A real-time Security Operations Center (SOC) dashboard. Streams live threat intelligence from real AbuseIPDB data with animated attack maps, analytics, incident management, detection rules, and multi-source threat enrichment.",
    img: signalForge,
    skills: [
      "Angular",
      "TypeScript",
      "Python",
      "PostgreSQL",
      "TanStack Query",
      "WebSockets",
      "FastAPI",
      "Groq",
    ],
    web: "https://signal-forge-tane.onrender.com/",
    github: "https://github.com/chenleiv/signal-forge",
    swagger: "https://signalforge-api-ah1q.onrender.com/docs",
    era: "latest",
  },
  {
    label: 3,
    header: "Memory Game",
    subHeader:
      "Angular SPA with dynamic difficulty levels, REST API leaderboard integration, and reactive component architecture.",
    img: memoryImg,
    skills: ["Angular", "TypeScript", "REST API", "SCSS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
    era: "older",
    // hideGithub: true,
  },
] as const;
