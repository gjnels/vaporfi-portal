/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,html}'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
}
