import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals: { supabase } }) => {
  const { data: flavors, error: err } = await supabase
    .from('flavors')
    .select('*')
    .order('category')
    .order('flavor')

  if (err || !flavors || flavors.length === 0) {
    throw error(404, 'There was a problem fetching custom blend flavors.')
  }

  return { flavors }
}) satisfies PageServerLoad
