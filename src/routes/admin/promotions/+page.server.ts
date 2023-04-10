import { error, fail } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

import type { Blend } from '$lib/types/flavors.types'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'

export const load = async ({ locals: { supabase } }) => {
  const { data: promos, error: err } = await supabase
    .from('promos')
    .select(
      `*,
      blend:custom_blend_id(
        name,
        flavor1:flavor1_id(flavor),
        flavor2:flavor2_id(flavor),
        flavor3:flavor3_id(flavor),
        shots1,
        shots2,
        shots3
      )`
    )
    .order('valid_until')
    .order('valid_from', { ascending: false })
    .order('title')
    .returns<Array<DatabaseRow<'promos'> & { blend: Blend | null }>>()

  if (!promos || err) {
    throw error(404, 'Error fetching promotions')
  }

  return {
    promos,
    form: superValidate(
      null,
      z.object({
        id: z.number().min(1).nullable().default(null)
      })
    )
  }
}

export const actions = {
  deletePromo: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(
      request,
      z.object({
        id: z.number().min(1)
      })
    )
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error } = await supabase
      .from('promos')
      .delete()
      .eq('id', form.data.id)

    if (error) {
      return message(form, error.message, { status: 400 })
    }

    return { form }
  }
}
