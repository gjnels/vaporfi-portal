import { error } from '@sveltejs/kit'

export const load = async (event) => {
  const {
    data: profiles,
    error: err,
    status
  } = await event.locals.supabase
    .from('profiles')
    .select('*, locations(name)')
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
