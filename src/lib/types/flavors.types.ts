import type { flavorPickerSchema } from '$lib/schemas/flavors'
import type { z } from 'zod'

export type Blend = {
  name?: string
  flavor1: { flavor: string } | string
  flavor2: { flavor: string } | string | null
  flavor3: { flavor: string } | string | null
  shots1: number
  shots2: number | null
  shots3: number | null
}

export type FlavorPickerBlend = z.infer<typeof flavorPickerSchema>
