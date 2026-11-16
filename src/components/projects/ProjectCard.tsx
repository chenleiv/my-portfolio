import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import type { CSSProperties } from "react";
import type { Project } from "./projectData";
import Image from "next/image";

type Props = {
    project: Project;
    // Carries --enter-delay for the staggered entrance.
    style?: CSSProperties;
    isFeatured?: boolean;
};

// One card per row: a large screenshot beside the content from 900px up, on
// top of it below that. All text comes from projectData.ts; the long subHeader
// stays in the data but is not shown here. The card has no fixed height, so
// nothing is clipped at any width.
export function ProjectCard({ project, style, isFeatured }: Props) {
    return (
        <article className="project-card" style={style}>
            <div className="project-shot">
                <Image
                    src={project.img}
                    alt={project.imgAlt ?? project.header}
                    className="project-shot__img"
                    loading="lazy"
                    fill
                    sizes="(min-width: 900px) 640px, 100vw"
                />
            </div>

            <div className="project-body">
                <div className="project-card__heading">
                    {isFeatured && <span className="project-featured-chip">✦ Featured</span>}
                    <h3 className="project-title">{project.header}</h3>
                </div>

                <p className="project-description">{project.summary}</p>

                <div className="project-stack">
                    {project.skills.map((skill) => (
                        <span key={`${project.label}-${skill}`} className="project-chip">
                            {skill}
                        </span>
                    ))}
                </div>

                <div className="project-links">
                    {!project.hideWeb && project.web && (
                        <a
                            href={project.web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link project-link--primary"
                            aria-label={`Live demo: ${project.header}`}
                        >
                            <ExternalLink size={14} />
                            Live Demo
                        </a>
                    )}
                    {!project.hideGithub && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link project-link--secondary"
                            aria-label={`Source code: ${project.header}`}
                        >
                            <FaGithub size={14} />
                            GitHub
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
