import React from 'react';
import { MdArrowDownward } from 'react-icons/md';

export default function Home() {
  return (
    <div className='header-section'>
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      <span className='first'>CHEN</span>
      <span className='last'>LEIV</span>
      <h3>FULL STACK DEVELOPER</h3>
      <div>
        <a href='#info' to='/'>
          <div className='chevron'></div>
          <div className='chevron'></div>
          <div className='chevron'></div>
        </a>
      </div>
    </div>
  );
}
