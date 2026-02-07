import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { PROJECTS, Project } from "./data/project";

export default function Projects() {
  const shouldReduceMotion = useReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.section
      id="projects"
      ref={ref}
      className="projects-section"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="projects-container">
        <motion.h2 className="projects-title" variants={itemVariants}>
          Projects
        </motion.h2>

        <div className="projects-grid">
          {PROJECTS.map((project: Project) => (
            <motion.div
              key={project.label}
              className="project-card"
              variants={itemVariants}
              {...(!shouldReduceMotion && {
                whileHover: { scale: 1.05, transition: { duration: 0.2 } },
              })}
            >
              <div className="project-image-container">
                <img
                  src={project.img}
                  alt={project.header}
                  className="project-image"
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={360}
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
                <h2 className="project-title">{project.header}</h2>
                <p className="project-description">{project.subHeader}</p>
                <div className="project-skills">
                  {project.skills.map((skill: string) => (
                    <span key={`${project.label}-${skill}`} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}