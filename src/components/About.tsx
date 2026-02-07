import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaGoogle,
  FaMicrosoft,
  FaFileDownload,
  FaMobileAlt,
} from "react-icons/fa";
import chenImage from "/assets/img/chen-bucky.webp";
import { InteractiveConsole } from "./InteractiveConsole";

const About = () => {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const emailOptions = [
    {
      name: "Gmail",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=chenleiv@gmail.com",
      icon: <FaGoogle />,
    },
    {
      name: "Outlook",
      url: "https://outlook.live.com/mail/0/deeplink/compose?to=chenleiv@gmail.com",
      icon: <FaMicrosoft />,
    },
  ];

  const handleDownloadCV = () => {
    const pdfUrl = `${import.meta.env.BASE_URL}assets/files/ChenLeiv-CV.pdf`;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "ChenLeiv-CV.pdf";
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowEmailOptions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
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
          <div className="console-wrapper">
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
              <img
                src={chenImage}
                alt="ChenBucky"
                className="profile-image"
                width={640}
                height={360}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />

              <motion.footer
                className="about-footer"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <div className="contact-info" id="info">
                  <a
                    href="https://www.linkedin.com/in/chen-leiv-9533a1178/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={24} />
                  </a>

                  <motion.button
                    type="button"
                    className="footer-link"
                    onClick={handleDownloadCV}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Download CV"
                    title="Download CV"
                  >
                    <FaFileDownload size={24} />
                  </motion.button>
                  <a
                    href="https://github.com/chenleiv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    aria-label="GitHub"
                  >
                    <FaGithub size={24} />
                  </a>
                  <a
                    href="tel:+972526656101"
                    className="footer-link"
                    title="Call me"
                    aria-label="Call me"
                  >
                    <FaMobileAlt size={24} />
                  </a>

                  <div className="email-container" ref={dropdownRef}>
                    <motion.button
                      type="button"
                      className="footer-link"
                      onClick={() => setShowEmailOptions((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Open email options"
                      aria-expanded={showEmailOptions}
                      aria-controls="email-options"
                    >
                      <FaEnvelope size={24} />
                    </motion.button>

                    {showEmailOptions && (
                      <motion.div
                        className="email-dropdown"
                        id="email-options"
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
                            title={`Open in ${option.name}`}
                            aria-label={`Open in ${option.name}`}
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
