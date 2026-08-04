import { motion } from "framer-motion";

import { styles } from "../styles";
import { ClapperCanvas } from "./canvas";
import { profile } from "../constants";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto">
      <div
        className={`z-10 absolute inset-0 top-[140px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-28 md:mt-5">
          <div className="w-5 h-5 rounded-full bg-gold" />
          <div className="w-1 sm:h-80 h-40 bg-gradient-to-b from-gold to-transparent" />
        </div>

        <div className="mt-28 md:mt-5">
          <p className="font-mono text-[12px] tracking-[0.2em] text-secondary uppercase mb-2">
            Talent Profile
          </p>
          <h1 className={styles.heroHeadText}>{profile.heroName}</h1>
          <p className={styles.heroSubText}>{profile.tagline}</p>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <ClapperCanvas />
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#stats">
          <div className="w-[35px] h-[64px] rounded-3xl border-2 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="w-3 h-3 rounded-full bg-gold mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
