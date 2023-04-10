import { error, fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

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
    form: superValidate(null, promoInsertSchema),
    customBlends
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, promoInsertSchema)
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error } = await event.locals.supabase.from('promos').insert({
      ...form.data,
      valid_from: form.data.valid_from.toISOString(),
      valid_until: form.data.valid_until.toISOString()
    })

    if (error) {
      console.log(error)
      return message(form, error.message, { status: 400 })
    }

    throw redirect(302, '/admin/promotions')
  }
}
