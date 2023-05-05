import type { Blend } from './flavors.types'
import type { DatabaseRow } from './supabaseHelpers.types'

export type Promo = DatabaseRow<'promos'> & { blend: Blend | null }
