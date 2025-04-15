import { motion } from 'framer-motion';

const Footer = () => {


  return (
    <motion.footer
      id="contact"
      className="footer-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
        <div className="footer-bottom">
          <a href="#about" className="footer-link"> 
            back to About
          </a>
      </div>
    </motion.footer>
  );
};

export default Footer;