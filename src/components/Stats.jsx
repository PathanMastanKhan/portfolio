import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { stats } from "../constants";

const StatsSection = () => {
  return (
    <>
      <motion.div variants={textVariant()} className="text-center">
        <p className={styles.sectionSubText}>Production Notes — Talent Data</p>
        <h2 className={styles.sectionHeadText}>Stats</h2>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-line border border-line">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeIn("up", "spring", i * 0.15, 0.6)}
            className="bg-primary p-7 flex flex-col gap-2"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
              {stat.label}
            </span>
            <span className="text-white-100 font-semibold text-[18px]">
              {stat.value}{" "}
              {stat.alt && (
                <span className="font-mono font-normal text-secondary text-[14px]">
                  / {stat.alt}
                </span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(StatsSection, "stats");
