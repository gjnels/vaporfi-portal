import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'

import type { Database } from '$lib/types/supabase.types'
import type { CurrentUserProfile } from '$lib/types/profile.types'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  const supabase = createSupabaseLoadClient<Database>({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
    event: { fetch },
    serverSession: data.session,
    cookieOptions: {
      sameSite: 'none',
      secure: true
    }
  })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const defaultData = {
    currentThemeCSS: data.currentThemeCSS,
    currentTheme: data.currentTheme,
    supabase,
    session
  }

  if (!session) {
    return {
      ...defaultData,
      currentProfile: null
    }
  }

  // Get the user profile if there is a valid session
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*, locations(id, name)')
    .eq('id', session.user.id)
    .single()

  if (!currentProfile) {
    await supabase.auth.signOut()
  }

  if (currentProfile?.role === 'Admin') {
    const { count: missingSkusCount } = await supabase
      .from('missing_skus')
      .select('*', { head: true, count: 'estimated' })
      .eq('fixed', false)
    const { count: incorrectSkusCount } = await supabase
      .from('incorrect_skus')
      .select('*', { head: true, count: 'estimated' })
      .eq('fixed', false)

    return {
      ...defaultData,
      currentProfile: currentProfile as CurrentUserProfile,
      missingSkusCount,
      incorrectSkusCount
    }
  }

  return {
    ...defaultData,
    currentProfile: currentProfile as CurrentUserProfile | null
  }
}
