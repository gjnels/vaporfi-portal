import { superValidate } from 'sveltekit-superforms/server'

import { emailSchema } from '$lib/schemas/auth'

export const load = async (event) => {
  return { form: superValidate(event, emailSchema) }
}
