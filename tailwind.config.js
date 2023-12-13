/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-green": "#1A472A",
        "light-green": "#6DBE45",
        "dark-blue": "#1C3D72",
        "light-blue": "#77A0D7",
        yellow: "#F2C94C",
        red: "#D0342C",
        "light-gray": "#E0E0E0",
        white: "#FFFFFF",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};
