import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import {
  flavorPickerRefinedSchema,
  flavorPickerSchema
} from '$lib/schemas/customBlends'

export const load = async ({ locals: { supabase } }) => {
  const { data: flavors, error: err } = await supabase
    .from('flavors')
    .select('*')
    .order('category')
    .order('flavor')

  if (err) {
    throw error(500, 'Unable to fetch custom blend flavors. Try again later.')
  }

  return {
    flavors,
    form: superValidate(null, flavorPickerSchema)
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, flavorPickerRefinedSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  }
}
