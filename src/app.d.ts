import type { Session, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '$lib/types/supabase.types'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>
      getSession(): Promise<Session | null>
      theme: string
    }
    // interface PageData {}
    // interface Platform {}
  }
}
