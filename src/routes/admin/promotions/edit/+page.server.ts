import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

import { promoSchema } from '$lib/schemas/promos.js'

export const load = async ({ url: { searchParams }, locals: { supabase } }) => {
  const promoId = searchParams.get('promo_id')
  if (!promoId) {
    throw redirect(303, '/admin/promotions')
  }

  const { data: promo, error: promosError } = await supabase
    .from('promos')
    .select('*')
    .eq('id', promoId)
    .single()

  if (promosError) {
    throw error(404, 'Promotion not found')
  }

  const { data: customBlends, error: customBlendsError } = await supabase
    .from('custom_blends')
    .select('id, name')
    .is('approved', true)

  if (customBlendsError) {
    throw error(500, 'Unable to fetch custom blends. Try again later.')
  }

  const foundPromo = {
    ...promo,
    valid_from: new Date(promo.valid_from),
    valid_until: new Date(promo.valid_until)
  }

  return {
    form: superValidate<typeof promoSchema, Message>(foundPromo, promoSchema),
    promo: foundPromo,
    customBlends
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate<typeof promoSchema, Message>(
      event,
      promoSchema
    )
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error } = await event.locals.supabase
      .from('promos')
      .update({
        ...form.data,
        valid_from: form.data.valid_from.toISOString(),
        valid_until: form.data.valid_until.toISOString()
      })
      .eq('id', form.data.id)

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
        message: 'Unable to update promotion. Try again later.'
      })
    }

    throw redirect(303, '/admin/promotions')
  }
}
