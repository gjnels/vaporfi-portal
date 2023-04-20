import { error } from '@sveltejs/kit'

import type { Blend } from '$lib/types/flavors.types'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'

export const load = async ({ locals: { supabase } }) => {
  const {
    data: promos,
    error: err,
    status
  } = await supabase
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
    .order('valid_until')
    .order('valid_from', { ascending: false })
    .order('title')
    .returns<Array<DatabaseRow<'promos'> & { blend: Blend | null }>>()

  if (err) {
    throw error(status, 'Promotions not found: ' + err.message)
  }

  return {
    promos
  }
}
