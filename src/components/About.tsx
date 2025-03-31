import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import chenImg from '../assets/img/chen.png';
const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      className="sub-section"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
     

        <motion.div
          className="flex gap-8 justify-center items-center"
          initial={{ y: 50 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >


          <div className="about-card">
          <motion.h2
          initial={{ x: -50 }}
          animate={inView ? { x: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          About Me
        </motion.h2>
        <motion.p
          initial={{ x: -50 }}
          animate={inView ? { x: 0 } : {}}
          transition={{ delay: 0.2 }}
        >   
            I'm a passionate Frontend Developer with three years of hands-on experience in modern web technologies, building scalable, high-performance applications using TypeScript.
A fast learner and problem solver, I hold a B.A. in Social Sciences and am a graduate of a coding bootcamp, bringing both analytical thinking and technical expertise to my work.
Always eager to learn, create, and innovate!
                </motion.p>
              </div>
          
          <motion.div
            className="relative"
            initial={{ scale: 0.8 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.6 }}
          > 
             <img src={chenImg}  alt="Profile" className='rounded-full' />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;