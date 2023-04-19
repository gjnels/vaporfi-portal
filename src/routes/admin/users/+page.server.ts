import { error, redirect } from '@sveltejs/kit'

export const load = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession()
  if (!session) {
    throw redirect(307, '/login?redirectTo=/admin/users')
  }

  const {
    data: profiles,
    error: err,
    status
  } = await supabase
    .from('profiles')
    .select('*, locations(name)')
    .not('id', 'eq', session.user.id) // don't need current user's profile
    .order('role', { ascending: false, nullsFirst: false })
    .order('name', { nullsFirst: false })
    .order('email')

  if (err) {
    throw error(status, 'Unable to fetch user profiles: ' + err.message)
  }

  return {
    profiles
  }
}
