import { profile } from "../constants";

const Footer = () => {
  return (
    <footer className="border-t border-line py-8 px-6 text-center font-mono text-[11px] tracking-[0.08em] text-secondary">
      © {new Date().getFullYear()} {profile.name} — Talent Profile
    </footer>
  );
};

export default Footer;
