import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
import type { PageServerLoad } from './$types'

type Blend = {
  name: string
  flavor1: { flavor: string }
  flavor2: { flavor: string } | null
  flavor3: { flavor: string } | null
  shots1: number
  shots2: number | null
  shots3: number | null
} | null

export const load = (async ({ locals: { supabase } }) => {
  const today = new Date().toISOString()

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
    .order('valid_from', { ascending: false })
    .order('valid_until')
    .order('title')
    .returns<Array<DatabaseRow<'promos'> & Blend>>()

  return { promos }
}) satisfies PageServerLoad
