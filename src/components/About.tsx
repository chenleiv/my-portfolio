import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import chenImage from '/assets/img/chen-bucky.jpeg';
import { FaEnvelope, FaGithub, FaDownload } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

const About = () => {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });


  const emailOptions = [
    {
      name: 'Gmail',
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=chenleiv@gmail.com',
      icon: 'G'
    },
    {
      name: 'Outlook',
      url: 'https://outlook.live.com/mail/0/deeplink/compose?to=chenleiv@gmail.com',
      icon: 'O'
    }
  ];

  const handleDownloadCV = () => {
    // Create a direct link to the PDF file with the base URL
    const pdfUrl = `${window.location.origin}/my-portfolio/assets/files/ChenLeiv-CV.pdf`;
    
    // Then try to trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'ChenLeiv-CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEmailOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 
  return (
    <motion.section
      id="about"
      ref={ref}
      className="about-section"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="about-container">
        <motion.div
          className="about-content"
          initial={{ y: 50 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <div className="about-card">
            <motion.h2
              className="about-title"
              initial={{ x: -50 }}
              animate={inView ? { x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              About Me
            </motion.h2>
            <motion.p
              className="about-text"
              initial={{ x: -50 }}
              animate={inView ? { x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >   
              I'm a passionate Frontend Developer with three years of hands-on experience in modern web technologies, building scalable, high-performance applications using TypeScript.
              A fast learner and problem solver, I hold a B.A. in Social Sciences and am a graduate of a coding bootcamp, bringing both analytical thinking and technical expertise to my work.
              Always eager to learn, create, and innovate!
            </motion.p>
          </div>
          
          <motion.div
            className="about-image-container"
            initial={{ scale: 0.8 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.6 }}
          > 
            <img 
              src={chenImage}  
              alt="Profile" 
              className="profile-image"
            />

          
            <motion.footer
              className="about-footer"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <div className="contact-info">
              <a href="https://github.com/chenleiv" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaGithub size={24} />
          </a>
          <a href="https://linkedin.com/in/chenleiv" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaLinkedin size={24} />
          </a>
          <div className="email-container" ref={dropdownRef}>
            <motion.button
              className="footer-link"
              onClick={() => setShowEmailOptions(!showEmailOptions)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaEnvelope size={24} />
            </motion.button>
            
            {showEmailOptions && (
              <motion.div 
                className="email-dropdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {emailOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="email-option"
                  >
                    <span className="email-icon">{option.icon}</span>
                    {option.name}
                  </a>
                ))}
              </motion.div>
            )}
          </div>
    
              </div>
              
            </motion.footer>
            
          </motion.div>
          
        </motion.div>
        
      </div>
    </motion.section>
  );
};

export default About;