import { error } from '@sveltejs/kit'

export const load = async ({ locals: { supabase } }) => {
  const { data: packets, error: err } = await supabase
    .from('nicotine_packets')
    .select('*')
    .order('salt')
    .order('mg')

  if (err || !packets || packets.length === 0) {
    throw error(404, 'Nicotine packets not found')
  }

  return { packets }
}
