import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

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

  if (
    profileError ||
    !profile ||
    (profile.role !== 'Admin' && profile.role !== 'Manager')
  ) {
    throw error(403) // Unauthorized
  }

  return {
    isAdmin: profile.role === 'Admin',
    form: superValidate<typeof insertCustomBlendSchema, Message>(
      null,
      insertCustomBlendSchema
    )
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate<
      typeof insertCustomBlendRefinedSchema,
      Message
    >(event, insertCustomBlendRefinedSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    // eslint-disable-next-line
    const { flavorCount, ...data } = form.data

    // created_by_profile_id and approved_by_profile_id handled by database

    const { error } = await event.locals.supabase
      .from('custom_blends')
      .insert(data)

    if (error) {
      // unique constraint violation
      // check these errors in case something slips by zod validation
      if (error.code === '23505') {
        // there is already a blend with the same flavors and shots
        if (error.message.includes('unique_blend')) {
          return message(form, {
            type: 'error',
            message: 'A custom blend with these flavors already exists.'
          })
        }
        // there is already a blend with this name
        if (error.message.includes('unique_name')) {
          return setError(form, 'name', 'This name is already taken')
        }
        // user tried to set the same flavor more than once
        if (error.message.includes('different_flavors')) {
          return message(form, {
            type: 'error',
            message: 'You cannot choose the same flavor more than once'
          })
        }
        // user set the total shots outside the limits
        if (error.message.includes('shots_between_1_and_3')) {
          return message(form, {
            type: 'error',
            message: 'Total number of shots must be between 1 and 3'
          })
        }
      }
      return message(form, {
        type: 'error',
        message: 'Unable to create custom blend. Try again later.'
      })
    }

    throw redirect(303, '/custom-blends')
  }
}
