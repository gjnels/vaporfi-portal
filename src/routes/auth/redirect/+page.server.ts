import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url: { searchParams } }) => {
  const action = searchParams.get('action')

  switch (action) {
    case 'password-reset':
    case 'accept-invite':
      return { redirectTo: '/change-password' }

    default:
      throw redirect(303, '/')
  }
}
