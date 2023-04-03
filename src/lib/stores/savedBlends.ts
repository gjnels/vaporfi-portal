import { browser } from '$app/environment'
import { flavorPickerRefinedSchema } from '$lib/schemas/flavors'
import type { FlavorPickerBlend } from '$lib/types/flavors.types'
import { get, writable } from 'svelte/store'

const STORAGE_KEY = 'vf-portal-saved-blends'

const getFromStorage = () => {
  if (browser) {
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      if (Array.isArray(parsedData)) {
        return parsedData.reduce((blends: FlavorPickerBlend[], savedBlend) => {
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

export const savedBlends = writable<FlavorPickerBlend[]>(getFromStorage())

export const storeSavedBlends = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(get(savedBlends)))
  } catch (error) {
    if (error instanceof DOMException) {
      return { error }
    }
    return { error: 'Failed to save blends to browser storage' }
  }
}
