import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
  // Imports theme as a string
  const modules = import.meta.glob(`$lib/themes/*.css`, { as: 'raw' })
  if (!Object.hasOwn(modules, `/src/lib/themes/theme-${locals.theme}.css`)) {
    // theme does not exist, set to 'vf'
    locals.theme = 'vf'
    cookies.set('theme', 'vf', { path: '/' })
    throw redirect(303, url.pathname + url.search) // rerun server hook
  }

  return {
    currentThemeCSS: modules[`/src/lib/themes/theme-${locals.theme}.css`](),
    currentTheme: locals.theme,
    session: locals.getSession()
  }
}
