import { motion, type Variants } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import type { Project } from "./projectData";
import Image from "next/image";

type Props = {
    project: Project;
    itemVariants: Variants;
    shouldReduceMotion: boolean;
};

export function ProjectCard({ project, itemVariants, shouldReduceMotion }: Props) {
    return (
        <motion.div
            className="project-card"
            variants={itemVariants}
            {...(!shouldReduceMotion && {
                whileHover: { scale: 1.05, transition: { duration: 0.2 } },
            })}
        >
            <div className="project-image-container">
                <Image
                    src={project.img}
                    alt={project.header}
                    className="project-image"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    width={640}
                    height={360}
                    priority
                />

                <div className="project-overlay">
                    <div className="project-actions">
                        {!project.hideWeb && project.web && (
                            <a
                                href={project.web}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-button"
                                aria-label={`Open live demo: ${project.header}`}
                            >
                                <FaExternalLinkAlt size={16} /> Live Demo
                            </a>
                        )}

                        {!project.hideGithub && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-button"
                                aria-label={`Open source code: ${project.header}`}
                            >
                                <FaGithub size={16} /> Source
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="project-info">
                <h3 className="project-title">{project.header}</h3>
                <p className="project-description">{project.subHeader}</p>

                <div className="project-skills">
                    {project.skills.map((skill) => (
                        <span key={`${project.label}-${skill}`} className="skill-tag">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}