import type { z } from 'zod'

import type { flavorPickerSchema, savedFlavorPickerBlendSchema } from '$lib/schemas/customBlends'
import type { DatabaseRow } from './supabaseHelpers.types'

export type Blend = {
  name?: string
  flavor1: { flavor: string } | string
  flavor2?: { flavor: string } | string | null
  flavor3?: { flavor: string } | string | null
  shots1: number
  shots2?: number | null
  shots3?: number | null
}

export type FlavorPickerBlend = z.infer<typeof flavorPickerSchema>
export type SavedFlavorPickerBlend = z.infer<typeof savedFlavorPickerBlendSchema>

export type CustomBlend = DatabaseRow<'custom_blends'> & {
  flavor1: DatabaseRow<'flavors'>
  flavor2: DatabaseRow<'flavors'> | null
  flavor3: DatabaseRow<'flavors'> | null
}
