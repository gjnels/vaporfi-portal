import { error, fail } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

import {
  copyCustomBlendSchema,
  deleteCustomBlendSchema
} from '$lib/schemas/customBlends.js'
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
        flavor1_id: number
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
    admin: role === 'Admin',
    copyForm: superValidate(null, copyCustomBlendSchema, { id: 'copy' }),
    deleteForm: superValidate(null, deleteCustomBlendSchema, { id: 'delete' })
  }
}

export const actions = {
  copyBlend: async (event) => {
    const form = await superValidate(event, copyCustomBlendSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  },

  deleteBlend: async (event) => {
    const form = await superValidate(event, deleteCustomBlendSchema)
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error } = await event.locals.supabase
      .from('custom_blends')
      .delete()
      .eq('id', form.data.id)

    if (error) {
      return message(form, 'Could not delete custom blend. Try again later.')
    }

    return { form }
  }
}
