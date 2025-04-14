import MainHeader from './components/MainHeader';
import Projects from './components/Projects';
import Footer from './components/Footer';
import MouseFollow from './components/MouseFollow';

function App() {
  return (
    <div>
      <MouseFollow />
      <section className="mt-4 mb-4">
        <MainHeader />
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