import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import About from './About';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 0.91,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.1,
    }
  }
};

const itemVariantsTitle = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 0.99,
    opacity: 1,
  },
};

interface Skill {
  id: string;
  icon: string;
  name: string;
}

interface DraggableSkillProps {
  skill: Skill;
  index: number;
  moveSkill: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableSkill = ({ skill, index, moveSkill }: DraggableSkillProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'SKILL',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setIsDraggingState(false);
    },
  });

  const [, drop] = useDrop({
    accept: 'SKILL',
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveSkill(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  useEffect(() => {
    if (isDragging) {
      setIsDraggingState(true);
    }
  }, [isDragging]);

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      className="skill-tag"
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        opacity: isDraggingState ? 0.8 : 1,
        background: isDraggingState ? 'rgb(231, 216, 216)' : 'transparent',
        boxShadow: isDraggingState ? '0 4px 8px rgba(250, 250, 250, 0.2)' : '0 2px 4px rgba(75, 75, 75, 0.7)',
        border: isDraggingState ? '1px solid #ccc' : 'none',
        cursor: 'move',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

      }}
    >
      {skill.name}
    </motion.div>
  );
};

const SkillsContainer = () => {
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', icon: 'react', name: 'React' },
    { id: '2', icon: 'typescript', name: 'TypeScript' },
    { id: '3', icon: 'angular', name: 'Angular' },
    { id: '4', icon: 'javascript', name: 'JavaScript' },
    { id: '5', icon: 'nodejs', name: 'Node.js' },
    { id: '6', icon: 'sass', name: 'SASS' },
    { id: '7', icon: 'regex', name: 'Regex' },
    { id: '8', icon: 'git', name: 'Git' },
    { id: '9', icon: 'npm', name: 'npm' },
    { id: '10', icon: 'webpack', name: 'Webpack' },
    { id: '11', icon: 'rest', name: 'RestApi' },
    { id: '12', icon: 'linux', name: 'Linux' },
    { id: '13', icon: 'mysql', name: 'MySQL' },
    { id: '14', icon: 'mongodb', name: 'MongoDB' },
  ]);

  const moveSkill = (dragIndex: number, hoverIndex: number) => {
    const dragSkill = skills[dragIndex];
    const newSkills = [...skills];
    newSkills.splice(dragIndex, 1);
    newSkills.splice(hoverIndex, 0, dragSkill);
    setSkills(newSkills);
  };

  return (
    <motion.div
      className="skills-container"
      variants={containerVariants}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 30px))',
        gridTemplateRows: 'repeat(auto-fill, minmax(50px, 100px))',
        textAlign: 'center',
        gap: '10px',
        width: '100%',
      }}
    >
      {skills.map((skill, index) => (
        <DraggableSkill
          key={skill.id}
          skill={skill}
          index={index}
          moveSkill={moveSkill}
        />
      ))}
    </motion.div>
  );
};

const MainHeader = () => {
  const [activeSection, setActiveSection] = useState('home');
  const headerOffset = 80;
  const [ref, inView] = useInView({
    threshold: 0.6,
    triggerOnce: true,
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + headerOffset;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className="main-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-container">
          <div className="nav-links">
            {['home', 'about', 'projects', 'contact'].map((section) => (
              <motion.button
                key={section}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
                onClick={() => scrollToSection(section)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      <motion.header
        id="home"
        className="main-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-container">
          <motion.h1
            className="heading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Chen Leiv
          </motion.h1>
          
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Frontend Developer
          </motion.p>

          <motion.div
            className="skills-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          />
        </div>
        <motion.section
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={itemVariantsTitle}
          style={{
            position: 'relative',
            minHeight: '200px',
            padding: '20px',
            background: 'transparent',
            borderRadius: '8px',
            margin: '20px 0',
          }}
        >
          <DndProvider backend={HTML5Backend}>
            <SkillsContainer />
          </DndProvider>
        </motion.section>

      <About />
      </motion.header>
    </>
  );
};

export default MainHeader;
