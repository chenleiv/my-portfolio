const memoryImg = "/assets/img/memory.webp";
const memeImg = "/assets/img/meme.webp";
const trellor1 = "/assets/img/trellor1.webp";
const aiWorkerSpaceImg = "/assets/img/knowledge.png";

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
    header: "AI Workspace",
    subHeader: "Manage your knowledge base with AI.",
    img: aiWorkerSpaceImg,
    skills: ["React | TypeScript | Node.js | Railway | MongoDB | HuggingFace"],
    web: "https://ai-knowledge.up.railway.app/",
    github: "https://github.com/chenleiv/ai-knowledge-workspace",
    era: "latest",
  },
  {
    label: 3,
    header: "Trello Clone",
    subHeader: "Trello-like task management app.",
    img: trellor1,
    skills: ["Vue.js | Vuex | Node.js | MongoDB | SCSS"],
    web: "https://trellor.onrender.com/#/",
    github: "https://github.com/chenleiv/trellor",
    era: "older",
  },
  {
    label: 4,
    header: "Memory Game",
    subHeader: "Classic memory game.",
    img: memoryImg,
    skills: ["Angular | TypeScript | REST API | SCSS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
    era: "older",
  },
  {
    label: 5,
    header: "Meme Generator",
    subHeader: "Make your own meme.",
    img: memeImg,
    skills: ["Vanilla JS | CSS"],
    web: "https://chenleiv.github.io/Meme-Generator/",
    github: "https://github.com/chenleiv/Meme-Generator",
    era: "older",
  },
] as const;
