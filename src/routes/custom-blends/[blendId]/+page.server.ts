import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

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

    if (!form.valid) {
      return fail(400, { form })
    }

    const { flavorCount, id, ...data } = form.data

    // approved_by_profile_id handled by database

    const { error } = await event.locals.supabase
      .from('custom_blends')
      .update(data)
      .eq('id', id)

    if (error) {
      // unique constraint violation
      // check these errors in case something slips by zod validation
      if (error.code === '23505') {
        // there is already a blend with the same flavors and shots
        if (error.message.includes('unique_blend')) {
          return message(
            form,
            'A custom blend with these flavors already exists.'
          )
        }
        // there is already a blend with this name
        if (error.message.includes('name')) {
          return setError(form, 'name', 'This name is already taken')
        }
        // user tried to set the same flavor more than once
        if (error.message.includes('different_flavors')) {
          return message(
            form,
            'You cannot choose the same flavor more than once'
          )
        }
        // user set the total shots outside the limits
        if (error.message.includes('shots_between_1_and_3')) {
          return message(form, 'Total number of shots must be between 1 and 3')
        }
      }
      return message(form, 'Could not update custom blend. Try again later.')
    }

    throw redirect(302, '/custom_blends')
  }
}