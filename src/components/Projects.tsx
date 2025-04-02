import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import socialImg from '/assets/img/social.png';
import memoryImg from '/assets/img/memory.png';
import bitcoinImg from '/assets/img/bitcoin.png';
import spaceImg from '/assets/img/space1.png';
import memeImg from '/assets/img/meme.png';
import trellor1 from '/assets/img/trellor1.png'; 
import { useState } from 'react';

interface Project {
  label: number;
  header: string;
  sub_header: string;
  img: string;
  skill: string[];
  web: string;
  github: string;
}


const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <motion.section
      ref={ref}
      className="sub-section"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container flex flex-col">
        <motion.h2 className="heading"  variants={itemVariants}>
          Projects
        </motion.h2>

        <div className="carousel-container">
          <button className="carousel-button prev" onClick={prevProject}>
            <FaChevronLeft />
          </button>
          
          <motion.div 
            className="carousel-content"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ 
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]
            }}
            key={currentIndex}
          >
            <div className="project-card">
              <img src={projects[currentIndex].img} alt={projects[currentIndex].header} />
              <div className="project-info">
                <h2>{projects[currentIndex].header}</h2>
                <p>{projects[currentIndex].sub_header}</p>
              </div>
                <div className="skills">
                {projects[currentIndex].skill.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
              <div className="actions">
                <a href={projects[currentIndex].web} target="_blank" rel="noopener noreferrer" className="button">
                  <FaExternalLinkAlt size={16} /> Live Demo
                </a>
                <a href={projects[currentIndex].github} target="_blank" rel="noopener noreferrer" className="button">
                  <FaGithub size={16} /> Source
                </a>
              </div>
            </div>
          </motion.div>

          <button className="carousel-button next" onClick={nextProject}>
            <FaChevronRight />
          </button>
        </div>

        <div className="carousel-thumbnails">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={project.img} alt={project.header} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Projects;

const projects: Project[] = [
  {
    label: 0,
    header: "Trllor",
    sub_header: "Trello based app.",
    img: trellor1,
    skill: ["Vue.js", "Vuex", "Node.js", "Mongodb", "SASS"],
    web: "https://trellor.onrender.com/#/",
    github: "https://github.com/chenleiv/trellor",
  },
  {
    label: 1,
    header: "Memory Game",
    sub_header: "Classic memory game.",
    img: memoryImg,
    skill: ["Angular", "TypeScript", "RestApi", "SASS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
  },
  {
    label: 2,
    header: "Meme Generator",
    sub_header: "Make your own meme.",
    img: memeImg,
    skill: ["Vanilla JS", "CSS"],
    web: "https://chenleiv.github.io/Meme-Generator/",
    github: "https://github.com/chenleiv/Meme-Generator",
  },
  {
    label: 3,
    header: "Social App",
    sub_header: "FaceBook look alike app.",
    img: socialImg,
    skill: ["React", "RestApi", "SASS"],
    web: "https://chenleiv.github.io/social-app/",
    github: "https://github.com/chenleiv/social-app/tree/main",
  },
  {
    label: 4,
    header: "Bitcoin",
    sub_header: "Bitcoin transfer.",
    img: bitcoinImg,
    skill: ["React", "Redux", "SASS"],
    web: "https://chenleiv.github.io/bitcoin-app-react/#/",
    github: "https://github.com/chenleiv/bitcoin-app-react/tree/master",
  },
  {
    label: 5,
    header: "SpaceY App",
    sub_header: "Landing info.",
    img: spaceImg,
    skill: ["React", "RestApi", "Redux", "SASS"],
    web: "https://chenleiv.github.io/space-y-react/#/",
    github: "https://github.com/chenleiv/space-x-react/tree/master",
  },

];
