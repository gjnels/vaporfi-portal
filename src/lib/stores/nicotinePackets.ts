import { get, writable } from 'svelte/store'

import { browser } from '$app/environment'

import { savedNicotinePacketSchema } from '$lib/schemas/nicotineCalculator'
import type { SavedNicotinePacket } from '$lib/types/nicotinePackets.types'

const STORAGE_KEY = 'vf-portal-nicotine-packets'

const getFromStorage = () => {
  if (browser) {
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      if (Array.isArray(parsedData)) {
        return parsedData.reduce(
          (packets: SavedNicotinePacket[], savedPacket) => {
            const result = savedNicotinePacketSchema.safeParse(savedPacket)
            if (result.success) {
              return [...packets, result.data]
            }
            return packets
          },
          []
        )
      }
    }
  }
  return []
}

export const savedPackets = writable<SavedNicotinePacket[]>(getFromStorage())

export const storeSavedPackets = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(get(savedPackets)))
    return { error: null }
  } catch (e) {
    return { error: 'Failed to save packet preferences to browser storage' }
  }
}
