import { redirect } from '@sveltejs/kit'

import { isRedirectAction, redirects } from '../redirectActions'

export const load = async ({ url: { searchParams } }) => {
  const action = searchParams.get('action')

  if (!isRedirectAction(action)) {
    throw redirect(303, '/')
  }

  return { redirectTo: redirects[action].redirectTo }
}
