import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, cookies, url }) => {
  // Imports theme as a string
  const modules = import.meta.glob(`$lib/themes/*.css`, { as: 'raw' })
  console.log(modules)
  if (!Object.hasOwn(modules, `/src/lib/themes/theme-${locals.theme}.css`)) {
    // theme does not exist, set to 'vf'
    locals.theme = 'vf'
    cookies.set('theme', 'vf', { path: '/' })
    throw redirect(303, url.pathname + url.search) // rerun server hook
  }
  console.log(await modules[`/src/lib/themes/theme-${locals.theme}.css`]())

  return {
    currentThemeCSS: modules[`/src/lib/themes/theme-${locals.theme}.css`](),
    currentTheme: locals.theme,
    session: locals.getSession()
  }
}
