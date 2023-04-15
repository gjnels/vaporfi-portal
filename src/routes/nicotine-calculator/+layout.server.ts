import { error } from '@sveltejs/kit'

export const load = async ({ locals: { supabase } }) => {
  const { data: packets, error: err } = await supabase
    .from('nicotine_packets')
    .select('*')
    .order('salt')
    .order('mg')

  if (err) {
    throw error(500, 'Unable to fetch nicotine packets. Try again later.')
  }

  return { packets }
}
