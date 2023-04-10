import { redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import { loginSchema } from '$lib/schemas/auth.js'

export const load = async ({
  locals: { getSession },
  url: { searchParams }
}) => {
  const session = await getSession()

  // Redirect when there is a valid session
  // No need to see login page if user is already logged in
  if (session) {
    throw redirect(302, searchParams.get('redirectTo') || '/')
  }

  return {
    form: superValidate(null, loginSchema)
  }
}
