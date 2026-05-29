const memoryImg = "/assets/img/memory.webp";
const signalForge = "/assets/img/signal.webp";
const trellor1 = "/assets/img/trellor1.webp";

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
  readonly hideWeb?: boolean;
  readonly hideGithub?: boolean;
  readonly era?: ProjectEra;
}

export const PROJECTS: readonly Project[] = [
  {
    label: 1,
    header: "InsightDesk — AI Platform",
    subHeader:
      "Full-stack AI platform with RAG-powered semantic search, and real-time document indexing.",
    img: aiWorkerSpaceImg,
    skills: ["React", "TypeScript", "Node.js", "Zod", "MongoDB", "Groq"],
    web: "https://insight-desk-bwji.onrender.com/",
    github: "https://github.com/chenleiv/insight-desk",
    era: "latest",
  },
  {
    label: 2,
    header: "SignalForge — SOC Dashboard",
    subHeader:
      "Full-stack project A real-time Security Operations Center dashboard.",
    img: signalForge,
    skills: ["Angular", "SCSS", "Python", "Groq", "rest API", "WebSockets"],
    // web: "https://trellor.onrender.com/#/",
    github: "https://github.com/chenleiv/signal-forge",
    era: "latest",
  },
  {
    label: 3,
    header: "Trello Clone",
    subHeader:
      "Full-stack project management app with drag-and-drop boards, Vuex state management, and a RESTful Node.js API.",
    img: trellor1,
    skills: ["Vue.js", "Vuex", "Node.js", "MongoDB", "SCSS"],
    web: "https://insight-desk-bwji.onrender.com/",
    github: "https://github.com/chenleiv/insight-desk",
    era: "older",
  },
  {
    label: 4,
    header: "Memory Game",
    subHeader:
      "Angular SPA with dynamic difficulty levels, REST API leaderboard integration, and reactive component architecture.",
    img: memoryImg,
    skills: ["Angular", "TypeScript", "REST API", "SCSS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
    era: "older",
  },
] as const;
