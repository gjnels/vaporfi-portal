import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import {
  updateCustomBlendRefinedSchema,
  updateCustomBlendSchema
} from '$lib/schemas/customBlends.js'

export const load = async ({ locals: { supabase, getSession }, params }) => {
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

  if (profile.role !== 'Admin') {
    throw error(403) // Unauthorized
  }

  const { data: blend, error: blendError } = await supabase
    .from('custom_blends')
    .select('*')
    .eq('id', params.blendId)
    .single()

  if (blendError || !blend) {
    throw error(404, 'Custom blend not found')
  }

  const flavorCount = blend.flavor3_id ? 3 : blend.flavor2_id ? 2 : 1

  return {
    form: superValidate({ ...blend, flavorCount }, updateCustomBlendSchema)
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, updateCustomBlendRefinedSchema)

    console.log(form)

    if (!form.valid) {
      return fail(400, { form })
    }

    return { form }
  }
}
