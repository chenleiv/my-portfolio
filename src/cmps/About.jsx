import React from "react";

export default function About() {
  return (
    <div id='about' className='about-container'>
      <div className='about'>
        <h2>
          <span>{"."}</span> About <span>{"{"}</span>
        </h2>
      </div>
      <p>
        My name is Chen, i'm a Frontend / Full-stack developer;
        <br />
        Work experience on React && TypeScript; <br />
        Vast knowledge in the latest WEB technologies, <br /> including
        ES6,React, Angular, Node.js etc.; <br />
        Graduate Coding Academy bootcamp; B.A Social-Sciences graduate; <br />
        Passionate about the field, problem solver, fast learner;
      </p>
      <span>{"}"}</span>

      <div className='about-img'>
        <img src='./assets/img/chen.png' alt='' />
      </div>
    </div>
  );
}
