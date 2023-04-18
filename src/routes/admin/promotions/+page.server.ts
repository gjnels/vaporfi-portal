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
      blend:custom_blends(
        name,
        flavor1(flavor),
        flavor2(flavor),
        flavor3(flavor),
        shots1,
        shots2,
        shots3
      )`
    )
    .order('valid_until')
    .order('valid_from', { ascending: false })
    .order('title')
    .returns<Array<DatabaseRow<'promos'> & { blend: Blend | null }>>()

  if (err) {
    throw error(404, 'Promotions not found')
  }

  return {
    promos
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
