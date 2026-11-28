const signalForge = "/assets/img/signal.webp";

const aiWorkerSpaceImg = "/assets/img/insight-desk.webp";

export interface Project {
  readonly label: number;
  readonly header: string;
  readonly summary: string;
  readonly subHeader: string;
  readonly img: string;
  readonly imgAlt?: string;
  readonly skills: readonly string[];
  readonly web?: string;
  readonly github: string;
  readonly hideWeb?: boolean;
  readonly hideGithub?: boolean;
}

export const PROJECTS: readonly Project[] = [
  {
    label: 1,
    header: "InsightDesk — AI Document Workspace",
    summary:
      "A full-stack document workspace with an AI assistant that answers from your own documents and verifies every citation. Try the live demo.",
    subHeader:
      "My flagship project: a full-stack document workspace with an AI assistant (RAG) that answers from your own documents and verifies every citation. Built end to end with a React frontend, Node.js backend and MongoDB, local embeddings for retrieval, automated tests, CI with CodeQL, and an evaluation suite. Security built in: CSP and secure cookies, hardened file uploads with isolated parsing, server-side session revocation, rate limits and daily question limits. Live demo.",
    img: aiWorkerSpaceImg,
    imgAlt: "InsightDesk chat answer with a cited source",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "RAG",
      "CodeQL",
      "Zod",
      "TanStack Query",
      "Groq",
    ],
    web: "https://insight-desk-bwji.onrender.com/",
    github: "https://github.com/chenleiv/insight-desk",
  },
  {
    label: 2,
    header: "SignalForge — Security Operations Platform",
    summary:
      "SOC dashboard demo, SIEM-inspired: alerts, incidents, threat hunting and IP enrichment on simulated data, with a documented security review.",
    subHeader:
      "Full-stack project: a real-time Security Operations Center (SOC) dashboard. Streams simulated security events built around real blacklisted IPs from AbuseIPDB, with animated attack maps, analytics, incident management, detection rules, and IP enrichment via AbuseIPDB and geolocation via ipinfo.",
    img: signalForge,
    skills: [
      "Angular",
      "TypeScript",
      "Python",
      "PostgreSQL",
      "WebSockets",
      "D3.js",
      "FastAPI",
      "Groq",
    ],
    web: "https://signalforge-api-ah1q.onrender.com/",
    github: "https://github.com/chenleiv/signal-forge",
  },
] as const;
