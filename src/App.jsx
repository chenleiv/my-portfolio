import Footer from "./cmps/Footer";
import MainHeader from "./cmps/MainHeader";
import SubHeader from "./cmps/SubHeader";
import About from "./cmps/About";
import Projects from "./cmps/Projects";
import SkillsList from "./cmps/SkillsList";

const App = () => {
  return (
    <div>
      <div id='home' className='App'>
        <div className='sub-header'>
          <MainHeader />
          <SubHeader />
        </div>
        <SkillsList />
        <Projects />
        <footer>
          <About />
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default App;
