import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  content: ['./src/**/*.{svelte,html,ts}'],
  plugins: [forms],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: colors.zinc['500'],
          ...colors.zinc
        },
        primary: {
          DEFAULT: colors.green['400'],
          ...colors.green
        },
        secondary: {
          DEFAULT: colors.indigo['500'],
          ...colors.indigo
        },
        danger: {
          DEFAULT: colors.red['500'],
          ...colors.red
        },
        warning: {
          DEFAULT: colors.yellow['500'],
          ...colors.yellow
        }
      }
    }
  }
} satisfies Config
