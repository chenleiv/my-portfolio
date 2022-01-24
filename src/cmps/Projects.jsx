import React from 'react';
import AOS from 'aos';
import { useEffect } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';

import 'aos/dist/aos.css';

export const Projects = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <section className='projects' id='projects'>
      <h1 data-aos='fade-down-left' className='header'>
        <span>{'{ '}</span>My<span>{'_'}</span>Projects <span>{'} ='}</span>
      </h1>
      <section className='project' data-aos='fade-in'>
        <div className='text'>
          <h1>Trellor</h1>
          <p>
            Trello based app. <br />
            Vue.js (CLI) | Vuex <br />
            Node.js | Mongodb-Atlas | SASS
          </p>
          <div className='btn'>
            <button>
              <a
                href='https://trellor-app.herokuapp.com/#/board/61b6082396e59cb9c30143d6'
                target='_blank'>
                Website
              </a>
            </button>
            <button>
              <a href='https://github.com/chenleiv/trellor' target='_blank'>
                Source Code
              </a>
            </button>
          </div>
        </div>
        <img src='./assets/img/trellor1.png' alt='' />
      </section>
      <section className='project' data-aos='fade-in'>
        <div className='text'>
          <h1>Bitcoin</h1>
          <p>
            Bitcoin transfer <br /> React.js | Redux | Api | SASS
          </p>
          <div className='btn'>
            <button>
              <a href='https://chenleiv.github.io/bitcoin-app-react/#/' target='_blank'>
                Website
              </a>
            </button>
            <button>
              <a href='https://github.com/chenleiv/bitcoin-app-react/tree/master' target='_blank'>
                Source Code
              </a>
            </button>
          </div>
        </div>
        <img src='./assets/img/bitcoin.png' alt='' />
      </section>

      <section className='project' data-aos='fade-in'>
        <div className='text'>
          <h1>SpaceX App</h1>
          <p>
            Landings info <br />
            React.js| Redux | Api | SASS
          </p>
          <div className='btn'>
            <button>
              <a href='https://chenleiv.github.io/space-x-react/#/' target='_blank'>
                Website
              </a>
            </button>
            <button>
              <a href='https://github.com/chenleiv/space-x-react/tree/master' target='_blank'>
                Source Code
              </a>
            </button>
          </div>
        </div>
        <img src='./assets/img/space1.png' alt='' />
      </section>
      {/* <section className='project' data-aos='fade-in'>
        <div className='text'>
          <h1>AppSus</h1>
          <p>
            Mail and note App <br /> Vue.js, SASS
          </p>
          <div className='btn'>
            <button>
              <a href='' target='_blank'>
                Website
              </a>
            </button>
            <button>
              <a href='' target='_blank'>
                Source Code
              </a>
            </button>
          </div>
        </div>
        <img src='../assets/img/chen.png' alt='' />
      </section> */}
      <section className='project' data-aos='fade-in'>
        <div className='text'>
          <h1>Meme Generator</h1>
          <p>
            Make your own meme <br /> Vanilla JS | CSS
          </p>
          <div className='btn'>
            <button>
              <a href='https://chenleiv.github.io/Meme-Generator/' target='_blank'>
                Website
              </a>
            </button>
            <button>
              <a href='https://github.com/chenleiv/Meme-Generator' target='_blank'>
                Source Code
              </a>
            </button>
          </div>
        </div>
        <img src='./assets/img/meme.png' alt='' />
      </section>
      <div className='up' data-aos='fade-up'>
        <a href='#home' to='/'>
          <AiOutlineArrowUp />
        </a>
      </div>
    </section>
  );
};
