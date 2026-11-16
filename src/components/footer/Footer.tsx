// Server Component: the links are plain anchors. Smooth scrolling and the
// fade-in are CSS (globals.scss and _footer.scss), both off with reduced motion.
const Footer = () => (
  <footer id="footer" className="footer-section">
    <div className="footer-bottom">
      <a href="#about" className="footer-link">
        About
      </a>
      <a href="#projects" className="footer-link">
        Projects
      </a>
    </div>
  </footer>
);

export default Footer;
