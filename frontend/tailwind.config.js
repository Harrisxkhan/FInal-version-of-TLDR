/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        "light-200": "#F4FAFD",
        "light-300": "#E5F5FC",
        "light-400": "#D5EBF9",
        "txt-100": "#666666",
        "txt-200": "#4D4D4D",
        "txt-300": "#333333",
        "txt-400": "#222222",
        "primary-100": "#585858ef",
      },
      fontFamily: {
        Jost: ["Jost", "sans-serif"],
        Itim: ["Itim", "cursive"],
      },
    },
  },
  plugins: [],
};
