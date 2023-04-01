import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { Database } from '$lib/types/supabase.types'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
import type { LayoutLoad } from './$types'

export const load = (async ({ fetch, data }) => {
  const supabase = createSupabaseLoadClient<Database>({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
    event: { fetch },
    serverSession: data.session
  })

  return { supabase }
}) satisfies LayoutLoad
