// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session, SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '$lib/types/supabase.types'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>
      getSession(): Promise<Session | null>
    }
    // interface PageData {}
    // interface Platform {}
  }
}
