import { error } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import { changePasswordSchema } from '$lib/schemas/auth.js'

export const load = async ({ locals: { getSession } }) => {
  if (!(await getSession())) {
    throw error(401)
  }

  return {
    form: superValidate(null, changePasswordSchema)
  }
}
