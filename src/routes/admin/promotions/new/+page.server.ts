import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

import { promoInsertSchema } from '$lib/schemas/promos'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'

export const load = async ({ locals: { supabase } }) => {
  const { data: customBlends, error: customBlendsError } = await supabase
    .from('custom_blends')
    .select(
      '*, flavor1:flavor1_id(flavor), flavor2:flavor2_id(flavor), flavor3:flavor3_id(flavor)'
    )
    .returns<
      (DatabaseRow<'custom_blends'> & {
        flavor1: string
        flavor2: string | null
        flavor3: string | null
      })[]
    >()

  if (!customBlends || customBlendsError) {
    throw error(404, 'Error fetching custom blends')
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
