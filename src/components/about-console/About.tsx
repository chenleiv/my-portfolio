"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import {
  FaGoogle,
  FaMicrosoft,
} from "react-icons/fa";
import { Github, Mail, Linkedin, FileDown, Smartphone } from "lucide-react";
const chenImage = "/assets/img/portfolio-v1.webp";
import { InteractiveConsole } from "./InteractiveConsole";
import Image from "next/image";

const About = () => {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const emailOptions = [
    {
      name: "Gmail",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=chenleiv1@gmail.com",
      icon: <FaGoogle />,
    },
    {
      name: "Outlook",
      url: "https://outlook.live.com/mail/0/deeplink/compose?to=chenleiv1@gmail.com",
      icon: <FaMicrosoft />,
    },
  ];

  const handleDownloadCV = () => {
    const pdfUrl = "/assets/files/ChenLeiv-CV.pdf";
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
              <Image
                src={chenImage}
                alt="ChenandBucky"
                className="profile-image"
                width={520}
                height={520}
                priority
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
                    className="about-link"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>

                  <motion.button
                    type="button"
                    className="about-link"
                    onClick={handleDownloadCV}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Download CV"
                    title="Download CV"
                  >
                    <FileDown size={20} />
                  </motion.button>
                  <a
                    href="https://github.com/chenleiv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-link"
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href="tel:+972526656101"
                    className="about-link"
                    title="Call me"
                    aria-label="Call me"
                  >
                    <Smartphone size={20} />
                  </a>

                  <div className="email-container" ref={dropdownRef}>
                    <motion.button
                      type="button"
                      className="about-link"
                      onClick={() => setShowEmailOptions((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Open email options"
                      aria-expanded={showEmailOptions}
                      aria-controls="email-options"
                    >
                      <Mail size={20} />
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
