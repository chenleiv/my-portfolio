export type CanonicalCommand =
  | "showProjects"
  | "contact"
  | "clear"
  | "recruiterMode";

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
    keywords: ["mode", "recruiter mode", "skills", "ideal", "hire", "talent"],
  },
  { id: "clear", label: "Clear Console", keywords: ["clear", "reset"] },
];

export const normalizeCommand = (raw: string): CanonicalCommand | null => {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/;+\s*$/, "") // remove trailing ;
    .replace(/\(\s*\)\s*$/, "") // remove trailing ()
    .replace(/\s+/g, ""); // remove ALL spaces

  switch (normalized) {
    case "showprojects":
    case "projects()":
      return "showProjects";
    case "contact":
    case "contact()":
    case "contactinfo()":
      return "contact";
    case "clear":
      return "clear";

    // recruiterMode variations
    case "recruitermode":
    case "recruiter":
    case "match":
    case "skills":
      return "recruiterMode";

    default:
      return null;
  }
};

export const toDisplayCommand = (cmd: CanonicalCommand) => `${cmd}`;
