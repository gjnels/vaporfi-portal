import type { Blend } from '$lib/types/flavors.types'
import { toastStore } from '@skeletonlabs/skeleton'
import { createBlendString } from './flavors'

export const copyToClipboard = (text: string, msgs: { success: string; error: string }) =>
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toastStore.trigger({ message: msgs.success, background: 'variant-filled-success' })
      return true
    })
    .catch(() => {
      toastStore.trigger({ message: msgs.error, background: 'variant-filled-error' })
      return false
    })

export const copyBlendToClipboard = (blend: Blend & { bottleCount: number; nicotine: number }) =>
  copyToClipboard(createBlendString(blend), {
    success: 'Blend has been copied to your clipboard.',
    error: 'Failed to copy blend to your clipboard.'
  })
