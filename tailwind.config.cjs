/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        "enter-right": "enter-right 200ms ease-out",
        "leave-right": "leave-right 150ms ease-in forwards",
        "enter-left": "enter-left 200ms ease-out",
        "leave-left": "leave-left 150ms ease-in forwards",
        "enter-top": "enter-top 200ms ease-out",
        "leave-top": "leave-top 150ms ease-in forwards",
        "enter-bottom": "enter-bottom 200ms ease-out",
        "leave-bottom": "leave-bottom 150ms ease-in forwards",
      },
      keyframes: {
        "enter-right": {
          "0%": { transform: "scale(0.9) translateX(100%)", opacity: 0 },
          "100%": { transform: "scale(1) translateX(0)", opacity: 1 },
        },
        "leave-right": {
          "0%": { transform: "scale(1) translateX(0)", opacity: 1 },
          "100%": { transform: "scale(0.9) translateX(100%)", opacity: 0 },
        },
        "enter-left": {
          "0%": { transform: "scale(0.9) translateX(-100%)", opacity: 0 },
          "100%": { transform: "scale(1) translateX(0)", opacity: 1 },
        },
        "leave-left": {
          "0%": { transform: "scale(1) translateX(0)", opacity: 1 },
          "100%": { transform: "scale(0.9) translateX(-100%)", opacity: 0 },
        },
        "enter-top": {
          "0%": { transform: "scale(0.9) translateY(-100%)", opacity: 0 },
          "100%": { transform: "scale(1) translateY(0)", opacity: 1 },
        },
        "leave-top": {
          "0%": { transform: "scale(1) translateY(0)", opacity: 1 },
          "100%": { transform: "scale(0.9) translateY(-100%)", opacity: 0 },
        },
        "enter-bottom": {
          "0%": { transform: "scale(0.9) translateY(100%)", opacity: 0 },
          "100%": { transform: "scale(1) translateY(0)", opacity: 1 },
        },
        "leave-bottom": {
          "0%": { transform: "scale(1) translateY(0)", opacity: 1 },
          "100%": { transform: "scale(0.9) translateY(100%)", opacity: 0 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
};
