import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import memoryImg from '/assets/img/memory.png';
import memeImg from '/assets/img/meme.png';
import trellor1 from '/assets/img/trellor1.png';
import aiWorkerSpaceImg from '/assets/img/knowledge.png';
import portfolioImg from '/assets/img/portfolio.png';

interface Project {
  label: number;
  header: string;
  sub_header: string;
  img: string;
  skill: string[];
  web?: string;
  github: string;
  hideWeb?: boolean;
  hideGithub?: boolean;
}

const Projects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
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
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="project-image-container">
                <img src={project.img} alt={project.header} className="project-image" />
                <div className="project-overlay">
                  <div className="project-actions">
                    {!project.hideWeb && project.web && (
                      <a
                        href={project.web}
                        target="_blank"
                        role="button"
                        rel="noopener noreferrer"
                        className="project-button"
                      >
                        <FaExternalLinkAlt size={16} /> Live Demo
                      </a>
                    )}

                    {!project.hideGithub && (
                      <a
                        href={project.github}
                        target="_blank"
                        role="button"
                        rel="noopener noreferrer"
                        className="project-button"
                      >
                        <FaGithub size={16} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="project-info">
                <h2 className="project-title">{project.header}</h2>
                <p className="project-description">{project.sub_header}</p>
                <div className="project-skills">
                  {project.skill.map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Projects;

const projects: Project[] = [
  {
    label: 1,
    header: "AI WorkrSpace",
    sub_header: "Manage your knowledge base with AI.",
    img: aiWorkerSpaceImg,
    skill: ["React", "TypeScript", "RestApi", "python", "cloudflare"],
    web: "https://ai-knowledge-workspace.pages.dev/",
    github: "https://github.com/chenleiv/ai-worker-space",
  },
  {
    label: 2,
    header: "Portfolio",
    sub_header: "My portfolio website.",
    img: portfolioImg,
    skill: ["React", "Vite", "TypeScript", "SASS"],
    github: "https://github.com/chenleiv/my-portfolio",
    hideWeb: true,
  },
  {
    label: 3,
    header: "Trllor",
    sub_header: "Trello based app.",
    img: trellor1,
    skill: ["Vue.js", "Vuex", "Node.js", "Mongodb", "SASS"],
    web: "https://trellor.onrender.com/#/",
    github: "https://github.com/chenleiv/trellor",
  },
  {
    label: 4,
    header: "Memory Game",
    sub_header: "Classic memory game.",
    img: memoryImg,
    skill: ["Angular", "TypeScript", "RestApi", "SASS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
  },
  {
    label: 5,
    header: "Meme Generator",
    sub_header: "Make your own meme.",
    img: memeImg,
    skill: ["Vanilla JS", "CSS"],
    web: "https://chenleiv.github.io/Meme-Generator/",
    github: "https://github.com/chenleiv/Meme-Generator",
  },
];
