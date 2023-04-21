import { error } from '@sveltejs/kit'

export const load = async ({ locals: { supabase }, parent }) => {
  const { session } = await parent()

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