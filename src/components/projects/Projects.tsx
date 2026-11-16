"use client";
import type { CSSProperties } from "react";
import { useInView } from "react-intersection-observer";
import { PROJECTS } from "./projectData";
import { ProjectCard } from "./ProjectCard";

// Seconds between the header and each card as they rise in (see _projects.scss).
const STAGGER = 0.15;

const enterDelay = (index: number) => ({ "--enter-delay": `${index * STAGGER}s` }) as CSSProperties;

export default function Projects() {
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true });

  return (
    <section ref={ref} className={`projects-section${inView ? " is-visible" : ""}`}>
      <div className="projects-container">
        <div className="projects-header" style={enterDelay(0)}>
          <h2 className="projects-title">Projects</h2>
        </div>

        <div className="projects-featured">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.label} project={project} style={enterDelay(i + 1)} isFeatured />
          ))}
        </div>
      </div>
    </section>
  );
}
