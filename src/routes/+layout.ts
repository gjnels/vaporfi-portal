import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'

import type { Database } from '$lib/types/supabase.types'

export const load = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  const supabase = createSupabaseLoadClient<Database>({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
    event: { fetch },
    serverSession: data.session
  })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  // Get the user profile if there is a valid session
  const currentProfile = await (async () => {
    if (!session) return null
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    return data
  })()

  return { supabase, session, currentProfile }
}
