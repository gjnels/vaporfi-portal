/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        enter: "enter 200ms ease-out",
        leave: "leave 150ms ease-in forwards",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9) translateX(100%)", opacity: 0 },
          "100%": { transform: "scale(1) translateX(0)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1) translateX(0)", opacity: 1 },
          "100%": { transform: "scale(0.9) translateX(100%)", opacity: 0 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
};
