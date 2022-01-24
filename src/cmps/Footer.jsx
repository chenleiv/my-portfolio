import React from 'react';
import { BsLinkedin } from 'react-icons/bs';
import { GrFacebook, GrGithub } from 'react-icons/gr';

export default function Footer() {
  return (
    <div id='info' className='main-footer-container'>
      <h2 className='contact'>
        {' '}
        <span>const </span>getInfo <span> {'= () => {'}</span>
      </h2>
      <div className='main-footer'>
        {/* <p>chenleiv@protonmail.com</p> */}
        <a href='mailto:chenleiv@protonmail.com'>chenleiv@protonmail.com</a>
        <a href='tel:+972 052-6656101'>+972 052-6656101</a>
      </div>
      <div className='footer-links'>
        <a href='https://github.com/chenleiv' target='_blank'>
          <GrGithub />
        </a>
        <a href='https://www.linkedin.com/in/chen-leiv-9533a1178/' target='_blank'>
          <BsLinkedin />
        </a>
        <a href='https://www.facebook.com/profile.php?id=100015211870278' target='_blank'>
          <GrFacebook />
        </a>
      </div>
    </div>
  );
}
