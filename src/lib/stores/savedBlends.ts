import { get, writable } from 'svelte/store'

import { browser } from '$app/environment'

import { flavorPickerRefinedSchema } from '$lib/schemas/customBlends'
import type { SavedFlavorPickerBlend } from '$lib/types/flavors.types'

const STORAGE_KEY = 'vf-portal-saved-blends'

const getFromStorage = () => {
  if (browser) {
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      if (Array.isArray(parsedData)) {
        return parsedData.reduce((blends: SavedFlavorPickerBlend[], savedBlend) => {
          const result = flavorPickerRefinedSchema.safeParse(savedBlend)
          if (result.success) {
            return [...blends, result.data]
          }
          return blends
        }, [])
      }
    }
  }
  return []
}

export const savedBlends = writable<SavedFlavorPickerBlend[]>(getFromStorage())

export const storeSavedBlends = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(get(savedBlends)))
    return { error: null }
  } catch (e) {
    return { error: 'Failed to save blends to browser storage' }
  }
}
