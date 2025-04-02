import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import chenImage from '/assets/img/chen.jpeg';

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
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row gap-8 justify-center items-center"
          initial={{ y: 50 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <div className="about-card w-full md:w-1/2">
            <motion.h2
              className="text-2xl md:text-3xl font-bold mb-4"
              initial={{ x: -50 }}
              animate={inView ? { x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-base md:text-lg leading-relaxed"
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
            className="relative w-full md:w-1/2 flex justify-center"
            initial={{ scale: 0.8 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.6 }}
          > 
            <img 
              src={chenImage}  
              alt="Profile" 
              className="rounded-full-lg w-64 h-64 md:w-80 md:h-80 object-cover" 
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;