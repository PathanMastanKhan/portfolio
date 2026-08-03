import { Navbar, Hero, Stats, Gallery, Contact, Footer, StarsCanvas } from "./components";

const App = () => {
  return (
    <div className="relative z-0 bg-primary">
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <Stats />
      <Gallery />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
        <Footer />
      </div>
    </div>
  );
};

export default App;
