import { redirect } from '@sveltejs/kit'

export const load = async ({ url: { searchParams } }) => {
  const action = searchParams.get('action')

  switch (action) {
    case 'password-reset':
    case 'accept-invite':
      return { redirectTo: '/change-password' }

    default:
      throw redirect(303, '/')
  }
}
