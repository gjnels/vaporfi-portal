import toast from 'svelte-french-toast'

import type { Blend } from '$lib/types/flavors.types'

import { createBlendString } from './flavors'

type Messages = Parameters<typeof toast.promise>['1']

export const copyToClipboard = (
  text: string,
  { loading, error, success }: Messages
) =>
  toast.promise(navigator.clipboard.writeText(text), {
    loading,
    error,
    success
  })

export const copyBlendToClipboard = (
  blend: Blend & { bottleCount: number; nicotine: number },
  msgs: Messages = {
    loading: 'Copying blend to clipboard...',
    error: 'Failed to copy blend to clipboard',
    success: 'Blend copied to clipboard.'
  }
) => copyToClipboard(createBlendString(blend), msgs)
