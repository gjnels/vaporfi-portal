import { error } from '@sveltejs/kit'

import type { DatabaseRow } from '$lib/types/supabaseHelpers.types.js'

export const load = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession()
  const role = session
    ? (
        await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
      ).data?.role ?? null
    : null

  const { data: blends, error: err } = await supabase
    .from('custom_blends')
    .select(
      '*, flavor1:flavor1_id(*), flavor2:flavor2_id(*), flavor3:flavor3_id(*)'
    )
    .order('name')
    .returns<
      (DatabaseRow<'custom_blends'> & {
        shots1: number
        flavor1: DatabaseRow<'flavors'>
        flavor2: DatabaseRow<'flavors'> | null
        flavor3: DatabaseRow<'flavors'> | null
      })[]
    >()

  if (err || !blends) {
    throw error(404, 'Error fetching custom blends')
  }

  return {
    blends,
    admin: role === 'Admin'
  }
}
