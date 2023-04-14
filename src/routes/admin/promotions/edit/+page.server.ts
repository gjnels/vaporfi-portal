import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

import { promoSchema } from '$lib/schemas/promos.js'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'

export const load = async ({ url: { searchParams }, locals: { supabase } }) => {
  const validatedSearchParam = z
    .number({ coerce: true })
    .int()
    .min(1)
    .safeParse(searchParams.get('promo_id'))
  if (!validatedSearchParam.success) {
    throw error(400, 'Invalid promotion id')
  }
  const promoId = validatedSearchParam.data

  const { data: promo, error: promosError } = await supabase
    .from('promos')
    .select('*')
    .eq('id', promoId)
    .single()

  if (!promo || promosError) {
    throw error(404, 'Promo not found')
  }

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
