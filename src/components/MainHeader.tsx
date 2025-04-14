import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import About from './About';
import { FaSpinner } from 'react-icons/fa';


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
  onRemove?: () => void;
  isAvailable?: boolean;
}

const DraggableSkill = ({ skill, index, moveSkill, onRemove, isAvailable }: DraggableSkillProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'SKILL',
    item: { index, skill, isAvailable },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      setIsDraggingState(false);
      if (!monitor.didDrop()) {
        return;
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'SKILL',
    drop: (item: { index: number; skill: Skill; isAvailable: boolean }) => {
      if (isAvailable !== item.isAvailable) {
        moveSkill(item.index, index);
      }
    },
    hover(item: { index: number; skill: Skill; isAvailable: boolean }, monitor) {
      if (!ref.current) return;
      if (isAvailable === item.isAvailable) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        moveSkill(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
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
      className={`skill-tag ${isAvailable ? 'available' : 'selected'}`}
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        opacity: isDraggingState ? 0.5 : 1,
        cursor: 'move',
        position: 'relative',
      }}
    >
      {skill.name}
      {!isAvailable && onRemove && (
        <button
          className="remove-skill"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

const SkillsContainer = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([
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

  const addSkill = (skill: Skill) => {
    if (!skills.find(s => s.id === skill.id)) {
      setSkills([...skills, skill]);
      // Remove from available skills
      setAvailableSkills(availableSkills.filter(s => s.id !== skill.id));
    }
  };

  const removeSkill = (skillId: string) => {
    const skillToRemove = skills.find(s => s.id === skillId);
    if (skillToRemove) {
      setSkills(skills.filter(skill => skill.id !== skillId));
      // Add back to available skills
      setAvailableSkills([...availableSkills, skillToRemove]);
    }
  };

  const clearSkills = () => {
    // Add all skills back to available
    setAvailableSkills([...availableSkills, ...skills]);
    setSkills([]);
    // Clear the search message
    setSearchMessage(null);
  };

  const searchMatches = async () => {
    setIsSearching(true);
    setSearchMessage(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show message in UI
    setSearchMessage('Found a match!');
    
    // Scroll to about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const headerOffset = 80;
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    setIsSearching(false);
  };

  return (
    <div className="skills-section">
      <div className="available-skills">
        <h3>Skills</h3>
        <div className="skills-list">
          {availableSkills.map((skill) => (
            <motion.div
              key={skill.id}
              className="skill-tag available"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addSkill(skill)}
            >
              {skill.name}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="selected-skills">
      <h3>Desired Skills</h3>
      <div className="skills-list">
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              className="skill-tag selected"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {skill.name}
              <button
                className="remove-skill"
                onClick={() => removeSkill(skill.id)}
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
        
          <div className="skills-actions">
            <button 
              className="clear-button"
              onClick={clearSkills}
              disabled={skills.length === 0}
            >
              Clear All
            </button>
            <button 
              className="search-button"
              onClick={searchMatches}
              disabled={skills.length === 0 || isSearching}
            >
              {isSearching ? (
                <>
                  <FaSpinner className="spinner" />
                  Searching...
                </>
              ) : (
                'Search Matches'
              )}
            </button>
          {/* </div> */}
        </div>
        {searchMessage && (
          <motion.div 
            className="search-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {searchMessage}
          </motion.div>
        )}

      </div>
    </div>
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
