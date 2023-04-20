import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import {
  copyCustomBlendSchema,
  deleteCustomBlendSchema
} from '$lib/schemas/customBlends.js'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types.js'

export const load = async ({ locals: { supabase } }) => {
  const {
    data: blends,
    error: err,
    status
  } = await supabase
    .from('custom_blends')
    .select('*, flavor1(*), flavor2(*), flavor3(*)')
    // show unapproved blends first, then sort by name
    .order('approved')
    .order('name')
    .returns<
      (DatabaseRow<'custom_blends'> & {
        flavor1: DatabaseRow<'flavors'>
        flavor2: DatabaseRow<'flavors'> | null
        flavor3: DatabaseRow<'flavors'> | null
      })[]
    >()

  if (err) {
    throw error(status, 'Unable to fetch custom blends. ' + err.message)
  }

  return {
    blends,
    copyForm: superValidate<typeof copyCustomBlendSchema, Message>(
      null,
      copyCustomBlendSchema,
      { id: 'copy' }
    ),
    deleteForm: superValidate<typeof deleteCustomBlendSchema, Message>(
      null,
      deleteCustomBlendSchema,
      { id: 'delete' }
    )
  }
}

export const actions = {
  copyBlend: async (event) => {
    const form = await superValidate<typeof copyCustomBlendSchema, Message>(
      event,
      copyCustomBlendSchema
    )
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  }
}
