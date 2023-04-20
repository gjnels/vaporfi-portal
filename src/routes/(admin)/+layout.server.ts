import { error, redirect } from '@sveltejs/kit'

export const load = async ({
  locals: { getSession, supabase },
  url,
  depends
}) => {
  depends('supabase:auth')

  const session = await getSession()

  if (!session) {
    throw redirect(307, `/login?redirectTo=${url.pathname}${url.search}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    await supabase.auth.signOut()
    throw redirect(307, `/login?redirectTo=${url.pathname}${url.search}`)
  }

  if (profile.role !== 'Admin') {
    throw error(403) // Unauthorized
  }

  return { session, profile }
}
