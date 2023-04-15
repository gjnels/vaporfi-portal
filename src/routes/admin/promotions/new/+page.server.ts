import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

import { promoInsertSchema } from '$lib/schemas/promos'

export const load = async ({ locals: { supabase } }) => {
  const { data: customBlends, error: customBlendsError } = await supabase
    .from('custom_blends')
    .select('id, name')
    .is('approved', true)

  if (customBlendsError) {
    throw error(500, 'Unable to fetch custom blends. Try again later.')
  }

  return {
    form: superValidate<typeof promoInsertSchema, Message>(
      null,
      promoInsertSchema
    ),
    customBlends
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate<typeof promoInsertSchema, Message>(
      event,
      promoInsertSchema
    )
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error } = await event.locals.supabase.from('promos').insert({
      ...form.data,
      valid_from: form.data.valid_from.toISOString(),
      valid_until: form.data.valid_until.toISOString()
    })

    if (error) {
      // unique constraint error
      if (error.code === '23505') {
        return setError(
          form,
          'title',
          'A promotion with this title already exists'
        )
      }
      return message(form, {
        type: 'error',
        message: 'Unable to create promotion. Try again later.'
      })
    }

    throw redirect(303, '/admin/promotions')
  }
}
