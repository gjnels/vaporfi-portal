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
    // if user is not an Admin, they can only view approved custom blends
    .filter('approved', 'in', role === 'Admin' ? '(true,false)' : '(true)')
    // show unapproved blends first, then sort by name
    .order('approved')
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
    throw error(404, 'Unable to fetch custom blends. Try again later.')
  }

  return {
    blends,
    isAdmin: role === 'Admin',
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
  },

  deleteBlend: async (event) => {
    const form = await superValidate<typeof deleteCustomBlendSchema, Message>(
      event,
      deleteCustomBlendSchema
    )
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error } = await event.locals.supabase
      .from('custom_blends')
      .delete()
      .eq('id', form.data.id)

    if (error) {
      return message(form, {
        type: 'error',
        message: 'Unable to delete custom blend. Try again later.'
      })
    }

    return { form }
  }
}
