import { redirect } from '@sveltejs/kit'

export const load = async ({ locals: { getSession }, url, depends }) => {
  depends('supabase:auth')

  const session = await getSession()

  if (!session) {
    throw redirect(307, `/login?redirectTo=${url.pathname}${url.search}`)
  }

  return { session }
}
