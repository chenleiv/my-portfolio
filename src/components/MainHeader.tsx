import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

const defaultSkills: string[] = [
  'TypeScript',
  'React',
  'Angular',
  'JavaScript',
  'Git',
  'SASS',
  'HTML',
  'Vite',
  'Node.js',
  'Next.js',
  'Express',
  'MongoDB',
  'Docker',
  'SQL',
];

const SkillsContainer = () => {
  const availableSkills = useMemo(() => [...defaultSkills], []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isMatch, setIsMatch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  const handleSkillClick = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleClearSearch = () => {
    setSelectedSkills([]);
    setIsMatch(false);
    setIsSearching(false);
    setSearchProgress(0);
  };

  const handleSearch = () => {
    if (selectedSkills.length === 0) return;
    
    setIsSearching(true);
    setSearchProgress(0);
    setIsMatch(false);

    // Simulate search progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate search completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsSearching(false);
      setIsMatch(true);
      
      // Scroll to header and about section
      const headerSection = document.getElementById('about');
      if (headerSection) {
        headerSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);
  };

  return (
    <div className="skills-section-container" id="skills">
      <h2>Select Desired Skills</h2>
      <div className="skills-list">
        {availableSkills.map((skill) => (
          <motion.button
            key={skill}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSkillClick(skill)}
            className={`skill-button ${selectedSkills.includes(skill) ? 'selected' : 'unselected'}`}
          >
            {skill}
          </motion.button>
        ))}
      </div>

      <div className="search-container">
        <div className="button-group">
          <button 
            className="search-button"
            onClick={handleSearch}
            disabled={selectedSkills.length === 0 || isSearching}
          >
            {isSearching ? 'Searching...' : 'Search Matches'}
          </button>
          {(selectedSkills.length > 0 || isMatch) && (
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
            Perfect match! 🎯
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MainHeader = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerOffset = 80;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

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
