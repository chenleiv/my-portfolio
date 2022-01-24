import React from 'react';
// import { Link } from 'react-router-dom';

export default function MainNav() {
  return (
    <div className='main-nav'>
      <a href='#home' to='/'>
        home
      </a>
      <a href='#projects' to='/'>
        projects
      </a>
      <a href='#about' to='/'>
        about
      </a>
      {/* <a href='#contact' to='/'>
        contact
      </a> */}
    </div>
  );
}
