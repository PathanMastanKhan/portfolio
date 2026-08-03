import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { contact } from "../constants";

const ContactSection = () => {
  return (
    <div className="max-w-[760px] mx-auto text-left">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Call Sheet</p>
        <h2 className={styles.sectionHeadText}>Contact Details</h2>
        <p className="text-secondary max-w-[52ch] mt-3 mb-10">
          For audition & availability — reach out directly.
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn("up", "spring", 0.2, 0.8)}
        className="border border-line mb-9"
      >
        <div className="flex justify-between items-center flex-wrap gap-2 py-4 px-6 border-b border-line">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Phone
          </span>
          <a href={contact.phoneHref} className="font-semibold text-white-100 hover:text-gold transition-colors">
            {contact.phone}
          </a>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-2 py-4 px-6 border-b border-line">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Email
          </span>
          <a href={contact.emailHref} className="font-semibold text-white-100 hover:text-gold transition-colors">
            {contact.email}
          </a>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-2 py-4 px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Location
          </span>
          <span className="font-semibold text-white-100">{contact.location}</span>
        </div>
      </motion.div>

      <motion.a
        variants={fadeIn("up", "spring", 0.3, 0.8)}
        href={contact.emailHref}
        className="inline-block font-mono text-[13px] uppercase tracking-[0.08em] bg-gold text-primary font-bold px-7 py-3.5 hover:bg-white-100 transition-colors"
      >
        Email to Book an Audition
      </motion.a>
    </div>
  );
};

export default SectionWrapper(ContactSection, "contact");
