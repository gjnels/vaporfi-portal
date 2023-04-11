import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import {
  insertCustomBlendRefinedSchema,
  insertCustomBlendSchema
} from '$lib/schemas/customBlends'

export const load = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession()
  if (!session) {
    throw error(401) // Unauthenticated
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profileError || !profile) {
    throw error(404, 'Error fetching your profile')
  }

  if (profile.role !== 'Admin' && profile.role !== 'Manager') {
    throw error(403) // Unauthorized
  }

  return {
    admin: profile.role === 'Admin',
    form: superValidate(null, insertCustomBlendSchema)
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, insertCustomBlendRefinedSchema)

    console.log(form)

    if (!form.valid) {
      return fail(400, { form })
    }

    return { form }
  }
}
