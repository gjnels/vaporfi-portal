import { error } from '@sveltejs/kit'

export const load = async ({ locals: { supabase } }) => {
  const { data: flavors, error: err } = await supabase
    .from('flavors')
    .select('*')
    .order('category')
    .order('flavor')

  if (err) {
    throw error(500, 'Unable to fetch custom blend flavors. Try again later.')
  }

  return { flavors }
}
