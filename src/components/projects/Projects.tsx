"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROJECTS } from "./projectData";
import { ProjectCard } from "./ProjectCard";

export default function Projects() {
  const shouldReduceMotion = useReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { y: shouldReduceMotion ? 0 : 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
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
        <motion.div className="projects-header" variants={itemVariants}>
          <h2 className="projects-title">Projects</h2>
        </motion.div>

        <div className="projects-featured">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.label}
              project={project}
              itemVariants={itemVariants}
              shouldReduceMotion={shouldReduceMotion ?? false}
              isFeatured
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
