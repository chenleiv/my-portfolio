import { FC, useState, useRef, useEffect } from 'react';
import '../styles/components.scss';
import { motion } from 'framer-motion';
import { FaFileMedicalAlt, FaGithub, FaLinkedin, FaMailBulk, FaEnvelope } from 'react-icons/fa';

interface SocialLink {
  url: string;
  icon: string;
}

// const socialLinks: SocialLink[] = [
//   { url: 'https://github.com/ChenLeiv', icon: 'fab fa-github' },  
//   { url: 'https://www.linkedin.com/in/chen-leiv-9533a1178/', icon: 'fab fa-linkedin' },
//   { url: 'https://www.facebook.com/profile.php?id=100015211870278', icon: 'fab fa-facebook' },
// ];

const Footer: FC = () => {
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

  const saveFile = () => {
    const link = document.createElement('a');
    link.href = '/assets/files/ChenLeiv-CV.pdf';
    link.download = 'ChenLeiv-cv.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='sub-section border-top'
    >
      <div className="footer-section">
        <motion.a
          href="https://github.com/ChenLeiv" 
          target="_blank"
          className="nav-link"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaGithub size={24} />
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/chen-leiv-9533a1178/"
          target="_blank"
          className="nav-link"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaLinkedin size={24} />
        </motion.a>
        <div className="email-container" ref={dropdownRef}>
          <motion.button
            className="nav-link"
            onClick={() => setShowEmailOptions(!showEmailOptions)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaEnvelope size={24} />
          </motion.button>
          
          {showEmailOptions && (
            <div className="email-dropdown">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=chenleiv1@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-item"
              >
                Gmail
              </a>
              <a
                href="https://outlook.live.com/mail/0/deeplink/compose?to=chenleiv1@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-item"
              >
                Outlook
              </a>
            </div>
          )}
        </div>
      </div>
      <div>
        <button onClick={saveFile} className='button'>
          Download resume
        </button>
      </div>
    </motion.footer>
  );
};

export default Footer;