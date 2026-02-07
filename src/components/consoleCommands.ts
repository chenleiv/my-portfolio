export type CanonicalCommand =
  | "showProjects"
  | "contact"
  | "clear"
  | "recruiterMode"
  | "portfolioCode"
  | "cv";

export type PaletteItem = {
  id: CanonicalCommand;
  label: string;
  keywords: string[];
};

export const PALETTE_ITEMS: PaletteItem[] = [
  {
    id: "showProjects",
    label: "Show Projects",
    keywords: ["projects", "work"],
  },
  { id: "contact", label: "Contact", keywords: ["contact", "email", "info"] },
  {
    id: "recruiterMode",
    label: "Recruiter mode",
    keywords: ["mode", "recruitermode", "skills"],
  },
  {
    id: "portfolioCode",
    label: "Open portfolio code",
    keywords: ["portfolio", "code", "github", "source"],
  },
  {
    id: "cv",
    label: "Download CV (PDF)",
    keywords: ["cv", "resume", "pdf", "download"],
  },
  { id: "clear", label: "Clear Console", keywords: ["clear", "reset"] },
];

export const normalizeCommand = (raw: string): CanonicalCommand | null => {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/;+\s*$/, "") // trailing ;
    .replace(/\(\s*\)\s*$/, "") // trailing ()
    .replace(/\s+/g, ""); // remove ALL spaces

  switch (normalized) {
    case "showprojects":
    case "projects":
      return "showProjects";

    case "contact":
    case "contactinfo":
      return "contact";

    case "clear":
    case "reset":
      return "clear";

    case "portfoliocode":
    case "sourcecode":
    case "code":
    case "github":
      return "portfolioCode";

    case "cv":
    case "cv()":
    case "resume":
    case "downloadcv":
    case "downloadcv()":
      return "cv";

    case "recruitermode":
    case "recruiter":
    case "match":
    case "skills":
      return "recruiterMode";

    default:
      return null;
  }
};

export const toDisplayCommand = (cmd: CanonicalCommand) => `${cmd}()`;
