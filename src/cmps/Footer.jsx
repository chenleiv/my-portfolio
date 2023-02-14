import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { GrFacebook, GrGithub } from "react-icons/gr";
import FileSaver from "file-saver";

const Footer = () => {
  const saveFile = () => {
    FileSaver.saveAs(
      process.env.PUBLIC_URL + "/assets/files/ChenLeiv-CV.pdf",
      "ChenLeiv-cv"
    );
  };
  return (
    <div id='info' className='main-footer-container'>
      <div>
        <span>const </span>
        <span> getInfo</span> <span> {"= () => {"}</span>
      </div>
      <div className='main-footer'>
        <a href='mailto:chenleiv1@email.com'>chenleiv1@gmail.com</a>
        <a href='tel:+972 052-6656101'>+972 052-6656101</a>
      </div>
      <div className='footer-links'>
        <a href='https://github.com/chenleiv' target='_blank' rel='noreferrer'>
          <GrGithub />
        </a>
        <a
          href='https://www.linkedin.com/in/chen-leiv-9533a1178/'
          target='_blank'
          rel='noreferrer'
        >
          <BsLinkedin />
        </a>
        <a
          href='https://www.facebook.com/profile.php?id=100015211870278'
          target='_blank'
          rel='noreferrer'
        >
          <GrFacebook />
        </a>
        <div>
          <button onClick={saveFile} className='resume'>
            Download resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
