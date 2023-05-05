/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'
import path from 'path'

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    path.join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
  ],
  theme: {
    extend: {}
  },
  plugins: [forms, ...skeleton()]
}
