import memoryImg from "/assets/img/memory.webp";
import memeImg from "/assets/img/meme.webp";
import trellor1 from "/assets/img/trellor1.webp";
import aiWorkerSpaceImg from "/assets/img/knowledge.webp";

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
}

export const PROJECTS: readonly Project[] = [
  {
    label: 1,
    header: "AI Workspace",
    subHeader: "Manage your knowledge base with AI.",
    img: aiWorkerSpaceImg,
    skills: ["React", "TypeScript", "REST API", "Python", "Cloudflare"],
    web: "https://ai-knowledge-workspace.pages.dev/",
    github: "https://github.com/chenleiv/ai-worker-space",
  },
  {
    label: 3,
    header: "Trello Clone",
    subHeader: "Trello-like task management app.",
    img: trellor1,
    skills: ["Vue.js", "Vuex", "Node.js", "MongoDB", "SCSS"],
    web: "https://trellor.onrender.com/#/",
    github: "https://github.com/chenleiv/trellor",
  },
  {
    label: 4,
    header: "Memory Game",
    subHeader: "Classic memory game.",
    img: memoryImg,
    skills: ["Angular", "TypeScript", "REST API", "SCSS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
  },
  {
    label: 5,
    header: "Meme Generator",
    subHeader: "Make your own meme.",
    img: memeImg,
    skills: ["Vanilla JS", "CSS"],
    web: "https://chenleiv.github.io/Meme-Generator/",
    github: "https://github.com/chenleiv/Meme-Generator",
  },
] as const;
