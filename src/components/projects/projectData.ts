const memoryImg = "/assets/img/memory.webp";
const memeImg = "/assets/img/meme.webp";
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
    subHeader: "Full-stack AI platform with RAG-powered semantic search, HuggingFace embeddings, and real-time document indexing.",
    img: aiWorkerSpaceImg,
    skills: ["React | TypeScript | Node.js | Railway | MongoDB | HuggingFace"],
    web: "https://insight-desk-bwji.onrender.com/",
    github: "https://github.com/chenleiv/insight-desk",
    era: "latest",
  },
  {
    label: 3,
    header: "Trello Clone",
    subHeader: "Full-stack project management app with drag-and-drop boards, Vuex state management, and a RESTful Node.js API.",
    img: trellor1,
    skills: ["Vue.js | Vuex | Node.js | MongoDB | SCSS"],
    web: "https://trellor.onrender.com/#/",
    github: "https://github.com/chenleiv/trellor",
    era: "older",
  },
  {
    label: 4,
    header: "Memory Game",
    subHeader: "Angular SPA with dynamic difficulty levels, REST API leaderboard integration, and reactive component architecture.",
    img: memoryImg,
    skills: ["Angular | TypeScript | REST API | SCSS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
    era: "older",
  },
  {
    label: 5,
    header: "Meme Generator",
    subHeader: "Client-side meme creator using Canvas API for real-time text overlay and image manipulation. Zero-dependency vanilla JS.",
    img: memeImg,
    skills: ["Vanilla JS | CSS"],
    web: "https://chenleiv.github.io/Meme-Generator/",
    github: "https://github.com/chenleiv/Meme-Generator",
    era: "older",
  },
] as const;
