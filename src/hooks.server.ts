import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'

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

  return resolve(event, {
    // Tell SvelteKit that supabase needs the content-range header
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}) satisfies Handle
