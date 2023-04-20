import type { Database } from './supabase.types'

type tables = keyof Database['public']['Tables']
export type DatabaseRow<T extends tables> =
  Database['public']['Tables'][T]['Row']

export type Role = Database['public']['Enums']['role'] | null
