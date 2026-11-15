import { contact } from "../../content/contact";
import { PROJECTS } from "../projects/projectData";
import { SKILL_GROUPS } from "../skills/skillsData";
import { BUCKY_TEXT, OFF_DUTY_TEXT, type ObjectKey } from "./roomContent";

interface PopupLink {
  readonly label: string;
  readonly href: string;
  readonly primary?: boolean;
  readonly external?: boolean;
  readonly download?: string;
}

const EMAIL: PopupLink = { label: "Email", href: `mailto:${contact.email}` };
const LINKEDIN: PopupLink = { label: "LinkedIn", href: contact.linkedin, external: true };
const GITHUB: PopupLink = { label: "GitHub", href: contact.github, external: true };

// Chips shown in the Skills popup, picked by name from skillsData.ts.
const SKILL_CHIPS = [
  "TypeScript",
  "React",
  "Angular",
  "Next.js",
  "SCSS",
  "Node.js",
  "MongoDB",
  "RAG/LLM apps",
  "Application Security",
  "OWASP Top 10",
];
const ALL_SKILLS = new Set(SKILL_GROUPS.flatMap((g) => g.skills));
const SKILLS = SKILL_CHIPS.filter((s) => ALL_SKILLS.has(s));

function Links({ links }: { links: readonly PopupLink[] }) {
  return (
    <div className="room-dialog__links">
      {links.map((l) => (
        <a
          key={l.label}
          className={`room-dialog__link${l.primary ? " room-dialog__link--primary" : ""}`}
          href={l.href}
          download={l.download}
          {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

function ProjectsBody() {
  return (
    <>
      {PROJECTS.map((project) => {
        const links: PopupLink[] = [];
        if (project.web && !project.hideWeb) links.push({ label: "Live demo", href: project.web, primary: true, external: true });
        if (!project.hideGithub) links.push({ label: "GitHub", href: project.github, external: true });
        return (
          <article key={project.label} className="room-dialog__project">
            <h3>{project.header.split(" — ")[0]}</h3>
            <p>{project.summary}</p>
            <Links links={links} />
          </article>
        );
      })}
    </>
  );
}

export function RoomPopupBody({ objectKey }: { objectKey: ObjectKey }) {
  switch (objectKey) {
    case "desk":
      return <ProjectsBody />;
    case "shelf":
      return (
        <>
          <p>Angular, React and TypeScript, plus application security.</p>
          <ul className="room-dialog__chips">
            {SKILLS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      );
    case "cv":
      return (
        <>
          <p>Download the CV and see how to reach me.</p>
          <Links links={[{ label: "Download CV", href: contact.cvPath, primary: true, download: contact.cvFileName }, EMAIL, LINKEDIN]} />
        </>
      );
    case "contact":
      return (
        <>
          <p>Email, LinkedIn and GitHub.</p>
          <Links links={[{ ...EMAIL, primary: true }, LINKEDIN, GITHUB]} />
        </>
      );
    case "tv":
      return <p>{OFF_DUTY_TEXT}</p>;
    case "bucky":
      return <p>{BUCKY_TEXT}</p>;
  }
}
