/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-in-out",
        "slide-out": "slide-out 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
