import type { Theme } from "../../context/ThemeContext";

// Character colors. Tune these freely; they are the same in both themes.
export const CHEN = {
  skin: "#f0cdb0",
  hair: "#c9a06a",
  shirt: "#2b2b33",
  jeans: "#3d5a80",
  shoes: "#f2f2f2",
  features: "#1d1530",
  mouth: "#c4636a",
} as const;

export const BUCKY = {
  coat: "#241c18",
  tan: "#b8733a",
  white: "#f6f1ea",
  features: "#1d1530",
} as const;

// Scene colors only. Everything outside the SVG uses the site tokens.
export interface ScenePalette {
  readonly isDark: boolean;
  readonly accent: string;
  // Letters on the accent skill book spine.
  readonly spineOnAccent: string;
  // Icon outlines and the GitHub circle on the contact board, on the paper color.
  readonly boardText: string;
  readonly wallL: string;
  readonly wallR: string;
  readonly wains: string;
  readonly floorA: string;
  readonly floorB: string;
  readonly wood: string;
  readonly shelf: string;
  readonly cab: string;
  readonly tv: string;
  readonly screen: string;
  readonly sofa: string;
  readonly rug: string;
  readonly rugB: string;
  readonly frame: string;
  readonly paper: string;
  readonly art1: string;
  readonly art2: string;
  readonly sky: string;
  readonly sea: string;
  readonly sand: string;
  readonly sun: string;
  readonly curtain: string;
  readonly brass: string;
  readonly lampShade: string;
  readonly glow: string;
  readonly leaf: string;
  readonly pot: string;
  readonly guitar: string;
  // Desk mug and its steam, chosen to show against the desk top.
  // Gaming chair body: a soft coral-peach that stays distinct from the floor and walls.
  readonly chair: string;
  readonly mug: string;
  readonly steam: string;
  readonly books: readonly string[];
}

const LIGHT: ScenePalette = {
  isDark: false,
  accent: "#ff6b4a",
  spineOnAccent: "#2a1f2d",
  boardText: "#2a1f2d",
  wallL: "#d3dfd1",
  wallR: "#e3ecdf",
  wains: "#f1ece1",
  floorA: "#cfc8bb",
  floorB: "#c6bfb1",
  wood: "#d9bf94",
  shelf: "#f0e7d6",
  cab: "#e2d3b8",
  tv: "#22192f",
  screen: "#7fe6d4",
  sofa: "#5b8f8b",
  rug: "#cf8f8a",
  rugB: "#f1e6cc",
  frame: "#cfa86e",
  paper: "#fbf6ea",
  art1: "#2a6f6a",
  art2: "#ff6b4a",
  sky: "#ffc58f",
  sea: "#2fa4b8",
  sand: "#f5dca5",
  sun: "#ff6b4a",
  curtain: "#e3a98e",
  brass: "#c9a24e",
  lampShade: "#fff0c8",
  glow: "#ffd98a",
  leaf: "#4f8a4b",
  pot: "#b5603a",
  guitar: "#c97b3d",
  chair: "#f0997f",
  mug: "#5b8f8b",
  steam: "#6b7470",
  books: ["#e8a5a0", "#8fbfb7", "#f2cf86", "#9db7d6", "#c9a6d6"],
};

// Dark room: calm night colors, no neon. The accent matches the site's dark accent.
const DARK: ScenePalette = {
  isDark: true,
  accent: "#ff8a6a",
  spineOnAccent: "#0a1020",
  boardText: "#f1ece0",
  wallL: "#222a4d",
  wallR: "#2b3360",
  wains: "#3a4373",
  floorA: "#66615a",
  floorB: "#5d5852",
  wood: "#8d7156",
  shelf: "#7e6a9a",
  cab: "#6f5a49",
  tv: "#0d0a1f",
  screen: "#5e9fa8",
  sofa: "#3f8f86",
  rug: "#7a3f5c",
  rugB: "#c9a24e",
  frame: "#b8975a",
  paper: "#2a315c",
  art1: "#6fa8b3",
  art2: "#ff8a5c",
  sky: "#3a3f78",
  sea: "#3b5f9a",
  sand: "#8a7aa8",
  sun: "#f0c46a",
  curtain: "#7a2f45",
  brass: "#d9b45a",
  lampShade: "#f6d98a",
  glow: "#ffd36a",
  leaf: "#3f9a6a",
  pot: "#8a4a32",
  guitar: "#b0703f",
  chair: "#ff986e",
  mug: "#f4f1ea",
  steam: "#e8edf2",
  books: ["#6fa8b3", "#e0866a", "#e6c46e", "#8a7aa8", "#6aa888"],
};

export const PALETTES: Record<Theme, ScenePalette> = { light: LIGHT, dark: DARK };
