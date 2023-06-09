import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
  const {
    data: packets,
    error: err,
    status
  } = await supabase.from('nicotine_packets').select('*').order('salt').order('mg')

  if (err) {
    throw error(status || 500, 'Unable to fetch nicotine packets: ' + err.message)
  }

  return { packets }
}
