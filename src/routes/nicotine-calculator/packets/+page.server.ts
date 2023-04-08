import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import {
  totalPacketsRefinedSchema,
  totalPacketsSchema
} from '$lib/schemas/nicotineCalculator'

export const load = async () => {
  return {
    form: superValidate(null, totalPacketsSchema)
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, totalPacketsRefinedSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  }
}
