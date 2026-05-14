import { motion, type Variants } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import type { Project } from "./projectData";
import Image from "next/image";

type Props = {
    project: Project;
    itemVariants: Variants;
    shouldReduceMotion: boolean;
    isFeatured?: boolean;
};

export function ProjectCard({ project, itemVariants, shouldReduceMotion, isFeatured }: Props) {
    return (
        <motion.article
            className={`project-card${isFeatured ? " project-card--featured" : ""}`}
            variants={itemVariants}
            whileHover={!shouldReduceMotion ? { y: -6, transition: { duration: 0.22, ease: "easeOut" } } : undefined}
        >
            <div className="project-image-wrap">
                <Image
                    src={project.img}
                    alt={project.header}
                    className="project-image"
                    loading="lazy"
                    width={640}
                    height={360}
                />
                {isFeatured && (
                    <span className="project-featured-badge">✦ Featured</span>
                )}
            </div>

            <div className="project-info">
                <div className="project-info__top">
                    <h3 className="project-title">{project.header}</h3>
                    <p className="project-description">{project.subHeader}</p>
                </div>

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
        </motion.article>
    );
}
