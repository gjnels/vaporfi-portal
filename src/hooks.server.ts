import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { type Handle, error, redirect } from '@sveltejs/kit'

import type { Database } from '$lib/types/supabase.types'

export const handle = (async ({ event, resolve }) => {
  // Initialize supabase client
  event.locals.supabase = createSupabaseServerClient<Database>({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
    event
  })

  // Helper function to get session
  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  // Protect all admin routes
  if (event.url.pathname.startsWith('/admin')) {
    const session = await event.locals.getSession()

    if (!session) {
      throw redirect(
        307,
        `/auth/login?redirectTo=${event.url.pathname + event.url.search}`
      )
    }

    const { data: profile, error: err } = await event.locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || err) {
      throw error(400, 'Error fetching your profile')
    }

    if (profile.role !== 'Admin') {
      throw error(403, 'You are not authorized to view this page')
    }
  }

  return resolve(event, {
    // Tell SvelteKit that supabase needs the content-range header
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}) satisfies Handle
