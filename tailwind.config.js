/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,html}'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')]
}
