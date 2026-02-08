import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { PROJECTS, Project } from "./data/project";
import { ProjectCard } from "./ProjectCard";

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

  const latestProjects = PROJECTS.filter(p => p.era === "latest");
  const olderProjects = PROJECTS.filter(p => p.era === "older");

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

        <div className="projects-latest">
          <motion.h3 variants={itemVariants} className="projects-subtitle">
            Latest Development
          </motion.h3>

          <div className="projects-grid">
            {latestProjects.map((project) => (
              <ProjectCard
                key={project.label}
                project={project}
                itemVariants={itemVariants}
                shouldReduceMotion={shouldReduceMotion ?? false}
              />
            ))}
          </div>
        </div>

        <div className="projects-older">
          <motion.h3 variants={itemVariants} className="projects-subtitle older">
            Older Projects
          </motion.h3>

          <div className="projects-grid">
            {olderProjects.map((project) => (
              <ProjectCard key={project.label} project={project} itemVariants={itemVariants} shouldReduceMotion={shouldReduceMotion ?? false} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}