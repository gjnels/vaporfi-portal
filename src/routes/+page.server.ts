import type { Blend } from '$lib/types/flavors.types'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'

export const load = async ({ locals: { supabase } }) => {
  const today = new Date().toUTCString()

  const { data: promos } = await supabase
    .from('promos')
    .select(
      `*,
      blend:custom_blend_id(
        name,
        flavor1:flavor1_id(flavor),
        flavor2:flavor2_id(flavor),
        flavor3:flavor3_id(flavor),
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
