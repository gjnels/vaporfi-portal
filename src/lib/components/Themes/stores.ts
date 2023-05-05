import { localStorageStore } from '@skeletonlabs/skeleton'
import type { Writable } from 'svelte/store'

// Persists select preset theme
export const storeTheme: Writable<string> = localStorageStore('storeTheme', 'vf')
