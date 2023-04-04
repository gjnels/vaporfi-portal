<script lang="ts">
  import { twMerge } from 'tailwind-merge'
  import type { Color } from '.'

  export let color: Color
  export let label: string
  export let hasError: boolean
  export let styles: string
</script>

<span
  class={twMerge(
    'ml-1 transition group-focus-within:text-white',
    color === 'green' && 'group-focus-within:text-green-400',
    color === 'purple' && 'group-focus-within:text-violet-400',
    hasError && 'text-rose-400 group-focus-within:text-rose-400',
    styles
  )}>{label}</span
>
