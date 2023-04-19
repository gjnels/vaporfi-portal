import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

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

  const {
    data: blends,
    error: err,
    status
  } = await supabase
    .from('custom_blends')
    .select('*, flavor1(*), flavor2(*), flavor3(*)')
    // if user is not an Admin, they can only view approved custom blends
    .filter('approved', 'in', role === 'Admin' ? '(true,false)' : '(true)')
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
    isAdmin: role === 'Admin',
    isManager: role === 'Manager',
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
