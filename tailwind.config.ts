import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  content: ['./src/**/*.{svelte,html,ts}'],
  plugins: [forms],
  theme: {
    extend: {
      colors: {
        base: colors.zinc,
        primary: colors.green,
        secondary: colors.violet,
        danger: colors.rose,
        error: colors.rose,
        info: colors.sky,
        warning: colors.yellow,
        success: colors.emerald
      }
    }
  }
} satisfies Config
