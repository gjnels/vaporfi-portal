import themes from '$components/Themes/themes.js'
import type { Blend } from '$lib/types/flavors.types'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const today = new Date().toUTCString()

  const { data: promos } = await supabase
    .from('promos')
    .select(
      `*,
      blend:custom_blends(
        name,
        flavor1(flavor),
        flavor2(flavor),
        flavor3(flavor),
        shots1,
        shots2,
        shots3
      )`
    )
    .lte('valid_from', today)
    .gte('valid_until', today)
    .order('valid_until')
    .order('valid_from', { ascending: false })
    .order('title')
    .returns<Array<DatabaseRow<'promos'> & { blend: Blend | null }>>()

  return { promos }
}

export const actions: Actions = {
  setTheme: async ({ request, cookies, locals }) => {
    const theme = (await request.formData()).get('theme') as string
    if (!themes.find(({ type }) => type === theme)) {
      return { theme: locals.theme }
    }
    cookies.set('theme', theme, { path: '/' })
    return { theme }
  }
}
