import { lazy, Suspense } from "react";
import { Navbar, Hero, Stats, Gallery, Contact, Footer } from "./components";

const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

const App = () => {
  return (
    <div className="relative z-0 bg-primary">
      <Suspense fallback={null}>
        <StarsCanvas />
      </Suspense>

      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <Stats />
      <Gallery />
      <div className="relative z-0">
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default App;
