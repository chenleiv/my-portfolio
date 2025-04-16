import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useFocus } from '../utils/FocusContext';

const defaultSkills: string[] = [
  'TypeScript',
  'React',
  'Angular',
  'JavaScript',
  'SASS',
  'HTML',
  'Regex',
  'REST API',
  'Jest',
  'Webpack',
  'Git',
  'Node.js',
  'MongoDB',
  'Docker',
  'MySQL',
];

const SkillsContainer = () => {
  const availableSkills = useMemo(() => [...defaultSkills], []);
  const [mustHaveSkills, setMustHaveSkills] = useState<string[]>([]);
  const [isMatch, setIsMatch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [draggedSkill, setDraggedSkill] = useState<string | null>(null);
  const [mustHaveInput, setMustHaveInput] = useState('');

  const { focusConsoleInput } = useFocus();

  const handleStartClick = () => {
    focusConsoleInput();
  };

  
  const handleDragStart = (skill: string) => {
    setDraggedSkill(skill);
  };

  const handleDragEnd = () => {
    setDraggedSkill(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedSkill) return;

    if (!mustHaveSkills.includes(draggedSkill)) {
      setMustHaveSkills([...mustHaveSkills, draggedSkill]);
      setMustHaveInput(prev => prev ? `${prev}, ${draggedSkill}` : draggedSkill);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMustHaveInput(e.target.value);
  };

  const handleClearSearch = () => {
    setMustHaveSkills([]);
    setMustHaveInput('');
    setIsMatch(false);
    setIsSearching(false);
    setSearchProgress(0);
  };

  const handleSearch = () => {
    if (mustHaveSkills.length === 0) return;
    
    setIsSearching(true);
    setSearchProgress(0);
    setIsMatch(false);

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(progressInterval);
      setIsSearching(false);
      setIsMatch(true);
      
      const matchMessage = document.querySelector('.match-message');
      if (matchMessage) {
        matchMessage.classList.add('fade-out');
      }

      const headerSection = document.getElementById('about');
      if (headerSection) {
        setTimeout(() => {
          handleStartClick();
          headerSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 500); 
      }
    }, 1000); 
  };

  const handleSkillClick = (skill: string) => {
    if (!mustHaveSkills.includes(skill)) {
      setMustHaveSkills([...mustHaveSkills, skill]);
      setMustHaveInput(prev => prev ? `${prev}, ${skill}` : skill);
    }
  };

  return (
    <div className="skills-section-container" id="skills">
     <h2>What skills should your ideal candidate have?</h2>
      <div className="skills-list">
        {availableSkills.map((skill) => (
          <motion.div
            key={skill}
            draggable
            onDragStart={() => handleDragStart(skill)}
            onDragEnd={handleDragEnd}
            onClick={() => handleSkillClick(skill)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`skill-item ${mustHaveSkills.includes(skill) ? 'selected' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {skill}
          </motion.div>
        ))}
      </div>

      <div className="skills-inputs-container">
        <div 
          className="skills-input-container must-have"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>Drag to input👇</p>
          <input
            type="text"
            value={mustHaveInput}
            placeholder="* required"
            onChange={handleInputChange}
            className="skills-input"
          />
        </div>
      </div>

      <div className="search-container">
        <div className="button-group">
          <button 
            className="search-button"
            onClick={() => {
              handleSearch();
            }}
            disabled={mustHaveSkills.length === 0 || isSearching}
          >
            {isSearching ? 'Searching...' : 'Search Matches'}
          </button>
          {(mustHaveSkills.length > 0 || isMatch) && (
            <button 
              className="clear-button"
              onClick={handleClearSearch}
              disabled={isSearching}
            >
              Clear Selection
            </button>
          )}
        </div>

        {isSearching && (
          <div className="search-progress">
            <div 
              className="progress-bar"
              style={{ width: `${searchProgress}%` }}
            />
            <span className="progress-text">{searchProgress}%</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isSearching && isMatch && (
          <motion.div
            key="match"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="match-message"
          >
           Perfect match detected 🤖
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MainHeader = () => {
  const [, setActiveSection] = useState('home');
  const headerOffset = 80;

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'projects'];
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
      <motion.div
        className="skills-section"
        id="skills-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SkillsContainer />
     </motion.div>  
    </>
  );
};

export default MainHeader;
