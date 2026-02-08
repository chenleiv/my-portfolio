import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Footer = () => {

  const openSkillMatcher = () => {
    document.getElementById("skills")?.scrollIntoView({ behavior: 'smooth' });
    window.openSkillMatcher?.();
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.substring(1);
    const targetElement = document.getElementById(targetId || '');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.footer
      id="footer"
      className="footer-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-bottom">
        <a href="#about" className="footer-link" onClick={handleClick} aria-label="About" target="_blank" rel="noopener noreferrer">
          About
        </a>
        <a href="#projects" className="footer-link" onClick={handleClick} aria-label="Projects" target="_blank" rel="noopener noreferrer">
          Projects
        </a>
        <a href="#skills" className="footer-link" onClick={openSkillMatcher} aria-label="Skills" target="_blank" rel="noopener noreferrer">
          Skills
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;