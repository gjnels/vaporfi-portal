import type { Actions, PageServerLoad } from './$types'
import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import {
  flavorPickerSchema,
  flavorPickerRefinedSchema
} from '$lib/schemas/customBlends'

export const load = (async ({ locals: { supabase } }) => {
  const { data: flavors, error: err } = await supabase
    .from('flavors')
    .select('*')
    .order('category')
    .order('flavor')

  if (err || !flavors || flavors.length === 0) {
    throw error(404, 'There was a problem fetching custom blend flavors.')
  }

  return {
    flavors,
    form: superValidate(null, flavorPickerSchema)
  }
}) satisfies PageServerLoad

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, flavorPickerRefinedSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  }
} satisfies Actions