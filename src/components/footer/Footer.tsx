"use client";
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

const Footer = () => {
  const shouldReduceMotion = useReducedMotion();

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
      targetElement.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <motion.footer
      id="footer"
      className="footer-section"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-bottom">
        <a href="#about" className="footer-link" onClick={handleClick}>
          About
        </a>
        <a href="#projects" className="footer-link" onClick={handleClick}>
          Projects
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;
