import { contact } from "../../content/contact";
import { PROJECTS } from "../projects/projectData";
import { Skills } from "../skills/Skills";
import { BUCKY_TEXT, CONTACT_TEXT, FOR_FUN_TEXT } from "../../content/room";
import type { ObjectKey } from "./roomContent";

interface PopupLink {
  readonly label: string;
  readonly href: string;
  readonly primary?: boolean;
  readonly external?: boolean;
  readonly download?: string;
}

const LINKEDIN: PopupLink = { label: "LinkedIn", href: contact.linkedin, external: true };
const GITHUB: PopupLink = { label: "GitHub", href: contact.github, external: true };

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
      return <Skills variant="chips" chipsClassName="room-dialog__chips" />;
    case "contact":
      return (
        <>
          <p>{CONTACT_TEXT}</p>
          <Links links={[{ label: "Download CV", href: contact.cvPath, primary: true, download: contact.cvFileName }, LINKEDIN, GITHUB]} />
        </>
      );
    case "tv":
      return <p>{FOR_FUN_TEXT}</p>;
    case "bucky":
      return <p>{BUCKY_TEXT}</p>;
  }
}
