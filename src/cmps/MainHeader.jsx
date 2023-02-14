import React from "react";

const MainHeader = () => {
  return (
    <div className='main-nav'>
      <div className='info'>
        <div>
          <a href='#projects' to='/'>
            Projects
          </a>
        </div>
        <div>
          <a href='#about' to='/'>
            Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
