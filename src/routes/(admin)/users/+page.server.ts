import type { DatabaseRow } from '$lib/types/supabaseHelpers.types.js'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { requireAuth } from '$lib/utils/auth'

export const load: PageServerLoad = async (event) => {
  const { session } = await requireAuth(event, ['Admin'])

  const {
    data: profiles,
    error: err,
    status
  } = await event.locals.supabase
    .from('profiles')
    .select('*, locations(name)')
    .not('id', 'eq', session.user.id) // don't need current user's profile
    .order('role', { ascending: false, nullsFirst: false })
    .order('name', { nullsFirst: false })
    .order('email')
    .returns<
      (DatabaseRow<'profiles'> & { locations: Pick<DatabaseRow<'locations'>, 'name'>[] | null })[]
    >()

  if (err) {
    throw error(status, 'Unable to fetch user profiles: ' + err.message)
  }

  return {
    profiles
  }
}
