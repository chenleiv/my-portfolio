import React from "react";
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaSass,
  FaNode,
  FaGitAlt,
} from "react-icons/fa";

import {
  SiJavascript,
  SiAngular,
  SiMongodb,
  SiTypescript,
  SiMobx,
  SiAtlassian,
  SiJirasoftware,
} from "react-icons/si";
const Skills = () => {
  return (
    <div className='skill-container'>
      <FaReact />
      <SiAngular />
      <SiTypescript />
      <SiJavascript />
      <FaHtml5 />
      <FaCss3Alt />
      <FaSass />
      <FaGitAlt />
      <FaNode />
      <SiMongodb />
      <SiMobx />
      <SiAtlassian />
      <SiJirasoftware />
    </div>
  );
};

export default Skills;
