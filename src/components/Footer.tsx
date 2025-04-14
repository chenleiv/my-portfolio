import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const Footer = () => {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <motion.footer
      id="contact"
      className="footer-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
        <div className="footer-bottom">
      <div className="footer-container">
        <h2 className="footer-title">Get in Touch</h2>
        
        <div className="footer-icons">
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

        <motion.button
          className="cv-button"
          onClick={handleDownloadCV}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaDownload size={20} />
          Download CV
        </motion.button>

      
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;