import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
  const {
    data: flavors,
    error: err,
    status
  } = await supabase.from('flavors').select('*').order('category').order('flavor')

  if (err) {
    throw error(status, 'Unable to fetch custom blend flavors. ' + err.message)
  }

  return { flavors }
}
