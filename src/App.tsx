import MainHeader from './components/MainHeader';
import Projects from './components/Projects';
import Footer from './components/Footer';
import MouseFollow from './components/MouseFollow';
import About from './components/About';
import Navigation from './components/Navigation';
import './styles/app.scss';

function App() {
  return (
    <div className="app">
      <MouseFollow />
      <Navigation />
      <main className="app__main">
        <section id="home" className="app__section">
          <MainHeader />
        </section>
        
        <section id="about" className="app__section">
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