import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaGoogle, FaMicrosoft, FaFileDownload, FaMobileAlt } from 'react-icons/fa';
import chenImage from '/assets/img/chen-bucky.jpeg';
import { InteractiveConsole } from './AboutMeConsole';
const About = () => {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const emailOptions = [
    {
      name: 'Gmail',
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=chenleiv@gmail.com',
      icon: <FaGoogle />,
    },
    {
      name: 'Outlook',
      url: 'https://outlook.live.com/mail/0/deeplink/compose?to=chenleiv@gmail.com',
      icon: <FaMicrosoft   />,
    },
  ];

  const handleDownloadCV = () => {
    const pdfUrl = `${window.location.origin}/my-portfolio/assets/files/ChenLeiv-CV.pdf`;
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

<motion.header
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
        </div>
      </motion.header>
        <div className="about-container">

          <motion.div
            className="about-content"
            initial={{ y: 50 }}
            animate={inView ? { y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <div>
            <InteractiveConsole />
              
            </div>

            <motion.div
              id="contact"
              className="about-image-container"
              initial={{ scale: 0.8 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <motion.div className="contact-info-container">
                <img src={chenImage} alt="Profile" className="profile-image" />

                <motion.footer 
                  className="about-footer"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  <div className="contact-info" id="info">
                    <a href="https://www.linkedin.com/in/chen-leiv-9533a1178/" role="button" target="_blank" rel="noopener noreferrer" className="footer-link">
                      <FaLinkedin size={24} />
                    </a>

                    <motion.button
                      className="footer-link"
                      onClick={handleDownloadCV}
                      whileTap={{ scale: 0.9 }}
                      title="Download CV"
                    >
                      <FaFileDownload size={24} />
                    </motion.button>
                    <a href="https://github.com/chenleiv" role="button" target="_blank" rel="noopener noreferrer" className="footer-link">
                      <FaGithub size={24} />
                    </a>
                    <a href="tel:+972526656101" role="button" className="footer-link" title="Call me">
                      <FaMobileAlt size={24} />
                    </a>

                    <div className="email-container" ref={dropdownRef}>
                      <motion.button
                        className="footer-link"
                        onClick={() => setShowEmailOptions(!showEmailOptions)}
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
                              role="button"
                              key={option.name}
                              href={option.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="email-option"
                              title={`Open in ${option.name}`}
                            >
                              <span className="email-icon">{option.icon}</span>
                              <span className="email-tooltip">{option.name}</span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.footer>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

  );
};

export default About;