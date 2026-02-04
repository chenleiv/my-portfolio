import MainHeader from './components/SkillsContainer';
import Projects from './components/Projects';
import Footer from './components/Footer';
import About from './components/About';
import './styles/app.scss';

function App() {
  return (
    <div className="app">
      <main className="app__main">
        <section id="about" className="app__section">
          <MainHeader />
          <About />
        </section>

        <section id="projects" className="app__section">
          <Projects />
        </section>
      </main>

      <footer className="app__footer">
        <Footer />
      </footer>
    </div>
  );
}

export default App;