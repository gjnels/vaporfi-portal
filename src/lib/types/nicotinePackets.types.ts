import type { z } from 'zod'

import type {
  nicotinePacketSchema,
  savedNicotinePacketSchema,
  totalNicotineSchema,
  totalPacketsSchema
} from '$lib/schemas/nicotineCalculator'

export type NicotinePacket = z.infer<typeof nicotinePacketSchema>
export type SavedNicotinePacket = z.infer<typeof savedNicotinePacketSchema>
export type PacketFormData = z.infer<typeof totalPacketsSchema>
export type SelectedPacket = Pick<z.infer<typeof totalNicotineSchema>, 'packets'>['packets'][number]
