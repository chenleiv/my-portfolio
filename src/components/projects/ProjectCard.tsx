import { motion, type Variants } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, SwatchBook } from "lucide-react";
import type { Project } from "./projectData";
import Image from "next/image";

type Props = {
    project: Project;
    itemVariants: Variants;
    shouldReduceMotion: boolean;
    isFeatured?: boolean;
};

// Compact card: a small screenshot beside the title, the short summary, the
// tags and every link. All text comes from projectData.ts; the long subHeader
// stays in the data but is not shown here. The card has no fixed height, so
// nothing is clipped at any width.
export function ProjectCard({ project, itemVariants, shouldReduceMotion, isFeatured }: Props) {
    return (
        <motion.article
            className="project-card"
            variants={itemVariants}
            whileHover={!shouldReduceMotion ? { y: -6, transition: { duration: 0.22, ease: "easeOut" } } : undefined}
        >
            <div className="project-card__head">
                <div className="project-thumb">
                    <Image
                        src={project.img}
                        alt={project.imgAlt ?? project.header}
                        className="project-thumb__img"
                        loading="lazy"
                        width={192}
                        height={108}
                        sizes="96px"
                    />
                </div>
                <div className="project-card__heading">
                    {isFeatured && <span className="project-featured-chip">✦ Featured</span>}
                    <h3 className="project-title">{project.header}</h3>
                </div>
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
                {project.swagger && (
                    <a
                        href={project.swagger}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link project-link--secondary"
                        aria-label={`API documentation: ${project.header}`}
                    >
                        <SwatchBook size={14} />
                        API Docs
                    </a>
                )}
            </div>
        </motion.article>
    );
}
