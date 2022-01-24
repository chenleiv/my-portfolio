import React, { useEffect } from 'react';
import { FaReact, FaVuejs, FaAngular, FaHtml5, FaCss3Alt, FaSass, FaNode } from 'react-icons/fa';
import { SiJavascript, SiMongodb } from 'react-icons/si';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

export default function Skills() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div>
      <div className='skills-list'>
        <div className='item' data-aos='fade-up-left'>
          {' '}
          <FaReact className='icon' />
          {/* React */}
        </div>
        <div className='item' data-aos='fade-right'>
          <FaVuejs className='icon' />
          {/* Vue.js */}
        </div>
        <div className='item' data-aos='fade-down'>
          {' '}
          <FaAngular className='icon' />
          {/* Angular */}
        </div>
        <div className='item' data-aos='flip-up'>
          {' '}
          <SiJavascript className='icon' />
          {/* Java script(ES6) */}
        </div>
        <div className='item' data-aos='fade-left'>
          {' '}
          <FaNode className='icon' />
          {/* Node.js */}
        </div>
        <div className='item' data-aos='fade-down-right'>
          {' '}
          <SiMongodb className='icon' />
          {/* MongoDB & Atlas */}
        </div>
        <div className='item' data-aos='flip-down'>
          {' '}
          <FaHtml5 className='icon' />
          {/* HTML5 */}
        </div>
        <div className='item' data-aos='fade-down-left'>
          {' '}
          <FaCss3Alt className='icon' />
          {/* CSS3 */}
        </div>
        <div className='item' data-aos='fade-up-right'>
          {' '}
          <FaSass className='icon' />
          {/* SASS */}
        </div>
        {/* <div className='item'>
          {' '}
          <SiTypescript className='icon' /> */}
        {/* Type Script */}
        {/* </div> */}
        {/* <div>OOP</div> */}
        {/* <div>Atlas</div> */}
      </div>
    </div>
  );
}
