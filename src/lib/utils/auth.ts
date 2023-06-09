import type { Role } from '$lib/types/supabaseHelpers.types'
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

export const requireAuth = async (event: ServerLoadEvent, roles?: Role[]) => {
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

  // Check for required role(s) of specified
  if (roles) {
    // Fetch user role
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

  return { session }
}
