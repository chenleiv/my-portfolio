import React from 'react';
import FileSaver from 'file-saver';

export default function About() {
  const saveFile = () => {
    FileSaver.saveAs(process.env.PUBLIC_URL + '/files/cv.pdf', 'chenLeiv-cv.pdf');
  };
  return (
    <div id='about' className='about-container'>
      <div className='about-header'>
        <img src='./assets/img/chen.png' alt='' />
        <div className='about'>
          <h2>
            <span>{'.'}</span> About <span>{'{'}</span>
          </h2>
        </div>
        <p>
          Graduate Coding Academy bootcamp; <br />
          Experience in writing web applications using the latest technologies;
          <br />
          B.A Social-Sciences graduate; <br />
          Passionate about the field, team player, problem solver, fast learner;
        </p>

        <span>{'}'}</span>
      </div>
      <a onClick={saveFile} className='resume'>
        Download resume{' '}
      </a>
    </div>
  );
}
