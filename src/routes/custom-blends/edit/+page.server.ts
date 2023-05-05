import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'
import {
  deleteCustomBlendSchema,
  updateCustomBlendRefinedSchema,
  updateCustomBlendSchema
} from '$lib/schemas/customBlends.js'
import type { CustomBlend } from '$lib/types/flavors.types.js'

export const load = async ({ locals: { supabase, getSession }, url: { searchParams } }) => {
  const blendId = searchParams.get('blend_id')
  if (!blendId) {
    throw redirect(303, '/custom-blends')
  }

  const session = await getSession()
  if (!session) {
    throw error(401) // Unauthenticated
  }

  const {
    data: profile,
    error: profileError,
    status: profileStatus
  } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()

  if (profileError) {
    throw error(profileStatus, 'Error fetching your profile: ' + profileError.message)
  }

  if (profile.role !== 'Admin') {
    throw error(403) // Unauthorized
  }

  const {
    data: blend,
    error: blendError,
    status: blendStatus
  } = await supabase
    .from('custom_blends')
    .select('*, flavor1(*), flavor2(*), flavor3(*)')
    .eq('id', blendId)
    .single()

  if (blendError) {
    throw error(blendStatus, 'Error fetching custom blend: ' + blendError.message)
  }

  const flavorCount = blend.flavor3_id ? 3 : blend.flavor2_id ? 2 : 1

  return {
    updateForm: superValidate({ ...blend, flavorCount }, updateCustomBlendSchema, {
      id: 'update_blend'
    }),
    deleteForm: superValidate({ id: blend.id }, deleteCustomBlendSchema, { id: 'delete_blend' }),
    blend: blend as CustomBlend
  }
}

export const actions = {
  updateBlend: async (event) => {
    const form = await superValidate<typeof updateCustomBlendRefinedSchema, Message>(
      event,
      updateCustomBlendRefinedSchema,
      { id: 'update_blend' }
    )

    if (!form.valid) {
      return fail(400, { form })
    }

    // eslint-disable-next-line
    const { flavorCount, id, ...data } = form.data

    // approved_by_profile_id handled by database
    const { error, status } = await event.locals.supabase
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
            {
              type: 'error',
              message: 'A custom blend with these flavors already exists.'
            },
            { status }
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
            {
              type: 'error',
              message: 'You cannot choose the same flavor more than once'
            },
            { status }
          )
        }
        // user set the total shots outside the limits
        if (error.message.includes('shots_between_1_and_3')) {
          return message(
            form,
            {
              type: 'error',
              message: 'Total number of shots must be between 1 and 3'
            },
            { status }
          )
        }
      }
      return message(
        form,
        {
          type: 'error',
          message: ['Unable to update custom blend.', error.message]
        },
        { status }
      )
    }

    throw redirect(303, '/custom-blends')
  },

  deleteBlend: async ({ locals: { supabase }, request }) => {
    const form = await superValidate<typeof deleteCustomBlendSchema, Message>(
      request,
      deleteCustomBlendSchema,
      { id: 'delete_blend' }
    )

    if (!form.valid) {
      return message(
        form,
        { type: 'error', message: 'Custom blend id is invalid' },
        { status: 400 }
      )
    }

    const { error, status } = await supabase
      .from('custom_blends')
      .delete()
      .eq('id', form.data.id)
      .select('id')
      .single()

    if (error) {
      return message(
        form,
        {
          type: 'error',
          message: [
            'Unable to delete custom blend.',
            error.code === 'PGRST116' ? 'Custom blend could not be found.' : error.message
          ]
        },
        { status }
      )
    }

    throw redirect(303, '/custom-blends')
  }
}
