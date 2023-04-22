import { error, fail, redirect } from '@sveltejs/kit'

import type { DatabaseRow } from '$lib/types/supabaseHelpers.types.js'

export const load = async ({ locals: { supabase } }) => {
  const {
    data: skus,
    error: err,
    status
  } = await supabase
    .from('missing_skus')
    .select(
      '*, submitted_from:locations(name), submitted_by:profiles(name, email)'
    )
    .order('item_name')
    .returns<
      (DatabaseRow<'missing_skus'> & {
        submitted_from: Pick<DatabaseRow<'locations'>, 'name'> | null
        submitted_by: Pick<DatabaseRow<'profiles'>, 'name' | 'email'> | null
      })[]
    >()

  if (err) {
    throw error(status, 'Unable to fetch missing SKUs: ' + err.message)
  }

  return {
    skus
  }
}

export const actions = {
  update: async ({ url: { searchParams }, locals: { supabase } }) => {
    const id = Number(searchParams.get('sku_id'))
    if (isNaN(id)) {
      return fail(400, { message: 'SKU id is missing' })
    }

    const fixed = searchParams.get('fixed') === 'true'

    const { error: err, status } = await supabase
      .from('missing_skus')
      .update({ fixed })
      .eq('id', id)
      .single()

    if (err) {
      return fail(status, {
        message: 'Unable to update record: ' + err.message
      })
    }

    throw redirect(303, '/missing-sku/manage')
  },

  delete: async ({ url: { searchParams }, locals: { supabase } }) => {
    const id = Number(searchParams.get('sku_id'))
    if (isNaN(id)) {
      return fail(400, { message: 'SKU id is missing' })
    }

    const { error: err, status } = await supabase
      .from('missing_skus')
      .delete()
      .eq('id', id)
      .single()

    if (err) {
      return fail(status, {
        message: 'Unable to delete record: ' + err.message
      })
    }

    throw redirect(303, '/missing-sku/manage')
  }
}
