import type { Session, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '$lib/types/supabase.types'
import type { CurrentUserProfile } from '$lib/types/profile.types'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>
      getSession(): Promise<Session | null>
      theme: string
    }
    interface PageData {
      supabase: SupabaseClient<Database>
      session: Session | null
      currentProfile: CurrentUserProfile | null
      missingSkusCount?: number
      incorrectSkusCount?: number
    }
    // interface Platform {}
  }
}
