// import HomePic from './cmps/HomePic';
import Footer from './cmps/Footer';
import MainNav from './cmps/MainNav';
import { Projects } from './cmps/Projects';
import SkillsList from './cmps/SkillsList';
import About from './cmps/About';
import { HashRouter as Router } from 'react-router-dom';
import AppHeader from './cmps/AppHeader';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import { useEffect } from 'react';
// ..

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <Router>
      <div id='home' className='App'>
        <header className='header-container'>
          <MainNav />
          <div>
            <AppHeader />
          </div>
          <div className='skills-container'></div>
          <SkillsList />
        </header>

        <main className='container'>
          <Projects />
        </main>
        <footer>
          {/* <div data-aos='fade-up'> */}
          <About />
          {/* </div> */}
          {/* <div data-aos='fade-down'> */}
          <Footer />
          {/* </div> */}
        </footer>
      </div>
    </Router>
  );
};

export default App;
