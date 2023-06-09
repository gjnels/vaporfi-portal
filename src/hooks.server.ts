import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'

import type { Database } from '$lib/types/supabase.types'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // Initialize supabase client
  event.locals.supabase = createSupabaseServerClient<Database>({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
    event,
    cookieOptions: {
      secure: true,
      sameSite: 'none'
    }
  })

  // Helper function to get session
  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  // Get preferred theme from cookies
  let theme = event.cookies.get('theme')
  // If no theme, set theme to vf (VaporFi)
  if (!theme) {
    event.cookies.set('theme', 'vf', { path: '/' })
    theme = 'vf'
  }
  event.locals.theme = theme

  return await resolve(event, {
    // Tell SvelteKit that supabase needs the content-range header
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}
