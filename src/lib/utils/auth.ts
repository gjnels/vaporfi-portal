import type { DatabaseRow, Role } from '$lib/types/supabaseHelpers.types'
import type { Session } from '@supabase/supabase-js'
import { error, redirect, type ServerLoadEvent } from '@sveltejs/kit'

/**
 * Converts all ```&``` symbols in ```val``` to ```^```
 *
 * Prevents search params from being stripped incorrectly,
 * specifically when posting to server actions
 *
 * @param val redirect string to alter
 * @returns altered redirect string
 */
export const alterRedirect = (val: string) => {
  return val.replaceAll('&', '^')
}

/**
 * Converts all ```^``` symbols in ```val``` to ```&```
 * @param val redirect string to parse
 * @returns parsed redirect string
 */
export const parseRedirect = (val: string) => {
  return val.replaceAll('^', '&')
}

type User =
  | DatabaseRow<'profiles'> & {
    locations: DatabaseRow<'locations'> | DatabaseRow<'locations'>[] | null
  }

export const requireAuth = async <
  U extends boolean = false,
  R = U extends true ? { session: Session; user: User } : { session: Session }
>({
  event,
  roles,
  returnUser
}: {
  event: ServerLoadEvent
  roles?: Role[]
  returnUser?: U
}): Promise<R> => {
  // Create login redirect
  const loginRedirectUrl = `/login?redirectTo=${alterRedirect(
    event.url.pathname + event.url.search
  )}`

  // Get current session if available
  const session = await event.locals.getSession()

  // No session, redirect to login page
  if (!session) {
    throw redirect(307, loginRedirectUrl)
  }

  let user: User | null = null

  if (returnUser) {
    const { data, error: err } = await event.locals.supabase
      .from('profiles')
      .select('*, locations(*)')
      .eq('id', session.user.id)
      .single()
    if (err) {
      await event.locals.supabase.auth.signOut()
      throw redirect(307, loginRedirectUrl)
    }
    user = data
  }

  // Check for required role(s) of specified
  if (roles) {
    if (user) {
      // User has already been fetched, don't refetch
      if (!roles.includes(user.role)) {
        throw error(403)
      }
    } else {
      // User has not been fetched yet, fetch role
      const { data, error: err } = await event.locals.supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      // Error fetching user, sign them out and redirect to login page
      if (err) {
        await event.locals.supabase.auth.signOut()
        throw redirect(307, loginRedirectUrl)
      }

      // User does not have the required role(s)
      if (!roles.includes(data.role)) {
        throw error(403)
      }
    }
  }

  if (returnUser) {
    return { session, user } as R
  } else {
    return { session } as R
  }
}
