/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0D0C0A",
        secondary: "#8C8577",
        tertiary: "#1C1A14",
        "black-100": "#17150F",
        "black-200": "#0A0908",
        "white-100": "#F3EFE6",
        gold: "#C89B3C",
        "gold-dim": "#8A6E30",
        velvet: "#7A1E1E",
        line: "#322E24",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0px 35px 120px -15px #000000",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
