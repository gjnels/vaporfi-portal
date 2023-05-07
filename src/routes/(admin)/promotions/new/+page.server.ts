import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

import { insertPromoSchema } from '$lib/schemas/promos'

export const load = async ({ locals: { supabase }, url: { searchParams } }) => {
  const {
    data: customBlends,
    error: err,
    status
  } = await supabase.from('custom_blends').select('id, name').is('approved', true).order('name')

  if (err) {
    throw error(status, 'Unable to fetch custom blends: ' + err.message)
  }

  // User was redirected from creating a new custom blend
  // Select that newly created blend by default
  const param_blend_id = searchParams.get('blend_id')
  if (param_blend_id) {
    const custom_blend_id = Number(param_blend_id)
    if (!isNaN(custom_blend_id) && customBlends.find(({ id }) => id === custom_blend_id)) {
      return {
        form: superValidate({ custom_blend_id }, insertPromoSchema, { errors: false }),
        customBlends
      }
    }
  }

  return {
    form: superValidate(insertPromoSchema),
    customBlends
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate<typeof insertPromoSchema, Message>(event, insertPromoSchema)
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error, status } = await event.locals.supabase.from('promos').insert({
      ...form.data,
      custom_blend_id: form.data.custom_blend_id || null, // if id is 0, make it null
      valid_from: form.data.valid_from.toISOString(),
      valid_until: form.data.valid_until.toISOString()
    })

    if (error) {
      // unique constraint error
      if (error.code === '23505') {
        return setError(form, 'title', 'A promotion with this title already exists')
      }
      return message(
        form,
        {
          type: 'error',
          message: ['Unable to create promotion.', error.message]
        },
        { status }
      )
    }

    throw redirect(303, '/promotions')
  }
}
