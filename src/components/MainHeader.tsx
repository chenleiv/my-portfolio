import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Skill {
  icon: string;
  name: string;
}

const MainHeader = () => {
const [ref, inView] = useInView({
  threshold: 0.1,
  triggerOnce: true,
});

const skills: Skill[] = [
{ icon: 'react', name: 'React' }, 
{ icon: 'typescript', name: 'TypeScript' },
{ icon: 'angular', name: 'Angular' },
{ icon: 'javascript', name: 'JavaScript' },
{ icon: 'nodejs', name: 'Node.js' },
{ icon: 'sass', name: 'SASS' },
{ icon: 'regex', name: 'Regex' },
{ icon: 'git', name: 'Git' },
{ icon: 'npm', name: 'npm' },
{ icon: 'webpack', name: 'Webpack' },
{ icon: 'rest', name: 'RestApi' },
{ icon: 'linux', name: 'Linux' },
{ icon: 'mysql', name: 'MySQL' },
{ icon: 'mongodb', name: 'MongoDB' },


];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 0.91,
    opacity: 1,
  },
};

const itemVariantsTitle = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 0.99,
    opacity: 1,
  },
};


  return (
    <motion.header
      className="section"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="header-container">
        <motion.h1
          className="heading"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
         Chen Leiv
        </motion.h1>
        
        <motion.p
          className="text-lg text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
         Forntend Develper
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
    
        </motion.div>
      </div>
      <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariantsTitle}
    >
      {/* <div className="container gap-4 flex flex-wrap justify-center"> */}
        <motion.div 
          className="container gap-4 flex flex-wrap justify-center"
          variants={containerVariants}
        >
          {skills.map((skill, index) => (
            <motion.div key={index} className="skill-tag" variants={itemVariants}>
              {skill.name}
            </motion.div>
          ))}
        </motion.div>
      {/* </div> */}
    </motion.section>
    </motion.header>
  );
};

export default MainHeader;