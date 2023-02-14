import React, { useEffect, useState } from "react";

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(projects.length);

  useEffect(() => {
    setLength(projects.length);
  }, []);

  const next = () => {
    if (currentIndex < length - 1) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  return (
    <section id='projects'>
      <h1 className='projects-header'>
        <span>{"{ "}</span>My<span>{"_"}</span>Projects <span>{"} ="}</span>
      </h1>

      <div className='container'>
        <div className='carousel'>
          <div className='carousel-wrapper'>
            <div className='carousel-content-wrapper'>
              {currentIndex > 0 && (
                <button className='btn-arrow-left' onClick={prev}>
                  <div className='arrow-left'></div>
                </button>
              )}
              <div
                className='carousel-content'
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                <ul className='carousel__slides'>
                  {projects.map(
                    ({
                      label,
                      header,
                      sub_header,
                      img,
                      skill,
                      web,
                      github,
                    }) => (
                      <li className='carousel__slide' key={label}>
                        <figure>
                          <div>
                            <img src={img} alt='' />
                          </div>
                          <figcaption>
                            <h1>{header}</h1>
                            <h3>{sub_header}</h3>
                            <span> {skill}</span>
                            <p className='btn'>
                              <button>
                                <a href={web} target='_blank' rel='noreferrer'>
                                  Website
                                </a>
                              </button>
                              <button>
                                <a
                                  href={github}
                                  target='_blank'
                                  rel='noreferrer'
                                >
                                  Source Code
                                </a>
                              </button>
                            </p>
                          </figcaption>
                        </figure>
                      </li>
                    )
                  )}
                </ul>
              </div>
              {currentIndex < length - 1 && (
                <button className='btn-arrow-right' onClick={next}>
                  <div className='arrow-right'></div>
                </button>
              )}
            </div>
          </div>

          <ul className='carousel__thumbnails'>
            {labels.map(({ id, src }) => {
              return (
                <li key={id}>
                  <label
                    onClick={() => {
                      setCurrentIndex(id);
                    }}
                  >
                    <img src={src} alt='project' />
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

const labels = [
  { id: 0, src: "./assets/img/trellor1.png" },
  { id: 1, src: "./assets/img/social.png" },
  { id: 2, src: "./assets/img/memory.png" },
  { id: 3, src: "./assets/img/bitcoin.png" },
  { id: 4, src: "./assets/img/space1.png" },
  { id: 5, src: "./assets/img/meme.png" },
];

const projects = [
  {
    label: 0,
    header: "Trllor",
    sub_header: "Trello based app.",
    img: "./assets/img/trellor1.png",
    skill: ["Vue.js", " Vuex", " Node.js", " Mongodb", " SASS"],
    web: "https://trellor.onrender.com/#/",
    github: "https://github.com/chenleiv/trellor",
  },
  {
    label: 1,
    header: "Social App",
    sub_header: "FaceBook look alike app.",
    img: "./assets/img/social.png",
    skill: ["React", " RestApi", " SASS"],
    web: "https://chenleiv.github.io/social-app/",
    github: "https://github.com/chenleiv/social-app/tree/main",
  },

  {
    label: 2,
    header: "Memory Game",
    sub_header: "Classic memory game.",
    img: "./assets/img/memory.png",
    skill: ["Angular", " TypeScript", " RestApi", " SASS"],
    web: "https://chenleiv.github.io/the-memory-game/",
    github: "https://github.com/chenleiv/the-memory-game",
  },

  {
    label: 3,
    header: "Bitcoin",
    sub_header: "Bitcoin transfer.",
    img: "./assets/img/bitcoin.png",
    skill: ["React", " Redux", " SASS"],
    web: "https://chenleiv.github.io/bitcoin-app-react/#/",
    github: "https://github.com/chenleiv/bitcoin-app-react/tree/master",
  },

  {
    label: 4,
    header: "SpaceX App",
    sub_header: "Landing info.",
    img: "./assets/img/space1.png",
    skill: ["React", " RestApi", " Redux", " SASS"],
    web: "https://chenleiv.github.io/space-x-react/#/",
    github: "https://github.com/chenleiv/space-x-react/tree/master",
  },

  {
    label: 5,
    header: "Meme Generator",
    sub_header: "Make your own meme.",
    img: "./assets/img/meme.png",
    skill: ["Vanilla JS", " CSS"],
    web: "https://chenleiv.github.io/Meme-Generator/",
    github: "https://github.com/chenleiv/Meme-Generator",
  },
];

export default Projects;
