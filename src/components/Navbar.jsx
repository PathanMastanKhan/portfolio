import React, { useEffect, useState } from "react";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";
import { useAdmin } from "../hooks/useAdmin";

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, exitAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 transition-colors ${
          scrolled ? "bg-primary/90 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
      >
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <button
            onClick={() => window.location.reload()}
            title="Refresh page"
            className="font-display text-gold text-[22px] tracking-[0.12em] bg-transparent border-none cursor-pointer"
          >
            P.M.K.
          </button>

          <ul className="list-none hidden sm:flex flex-row gap-10">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? "text-white-100" : "text-secondary"
                } hover:text-white-100 font-mono text-[13px] uppercase tracking-[0.1em] cursor-pointer`}
                onClick={() => {
                  setActive(nav.title);
                  scrollToSection(nav.id);
                }}
              >
                {nav.title}
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollToSection("contact")}
            className="hidden sm:inline-block font-mono text-[12px] uppercase tracking-[0.08em] border border-gold text-gold px-4 py-2 hover:bg-gold hover:text-primary transition-colors"
          >
            Contact
          </button>

          <div className="sm:hidden flex flex-1 justify-end items-center">
            <img
              src={toggle ? close : menu}
              alt="menu"
              className="w-[26px] h-[26px] object-contain invert"
              onClick={() => setToggle(!toggle)}
            />

            <div
              className={`${
                !toggle ? "hidden" : "flex"
              } p-6 bg-tertiary border border-line absolute top-16 right-0 mx-4 my-2 min-w-[160px] z-10`}
            >
              <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`font-mono text-[13px] uppercase tracking-[0.08em] cursor-pointer ${
                      active === nav.title ? "text-white-100" : "text-secondary"
                    }`}
                    onClick={() => {
                      setToggle(false);
                      setActive(nav.title);
                      scrollToSection(nav.id);
                    }}
                  >
                    {nav.title}
                  </li>
                ))}
                <li className="font-mono text-[13px] uppercase tracking-[0.08em] text-gold">
                  <button
                    onClick={() => {
                      setToggle(false);
                      scrollToSection("contact");
                    }}
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {isAdmin && (
        <div className="fixed top-[64px] w-full z-10 bg-gold/10 border-b border-line py-3 px-6 text-center font-mono text-[12px] tracking-[0.03em] text-gold">
          Admin view — only you see this. Visitors see the public page with no upload option.{" "}
          <button
            onClick={exitAdmin}
            className="underline text-secondary hover:text-gold ml-2"
          >
            Exit admin view
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
