import MainHeader from './components/MainHeader';
import Projects from './components/Projects';
import Footer from './components/Footer';
import MouseFollow from './components/MouseFollow';
import About from './components/About';

function App() {
  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-primary)]">
      <MouseFollow />
      <section className="mt-4 mb-4">
        <MainHeader />
        <About />
      </section>
      
      <section>
        <Projects />
      </section>
      
      <section>
        <Footer />
      </section>
    </div>
  );
}

export default App;