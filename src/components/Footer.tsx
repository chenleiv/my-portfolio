import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    // Set smooth scroll behavior for the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup function to reset scroll behavior
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
          <a href="#about" role="button" className="footer-link" onClick={handleClick}> 
            About
          </a>
          <a href="#projects" role="button" className="footer-link" onClick={handleClick}> 
           Projects
          </a>
          <a href="#skills" role="button" className="footer-link" onClick={handleClick}> 
            Skills
          </a>
      </div>
    </motion.footer>
  );
};

export default Footer;