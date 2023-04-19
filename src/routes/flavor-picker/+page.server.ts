import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import {
  flavorPickerRefinedSchema,
  flavorPickerSchema
} from '$lib/schemas/customBlends'

export const load = async ({ locals: { supabase } }) => {
  const {
    data: flavors,
    error: err,
    status
  } = await supabase
    .from('flavors')
    .select('*')
    .order('category')
    .order('flavor')

  if (err) {
    throw error(status, 'Unable to fetch custom blend flavors: ' + err.message)
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
