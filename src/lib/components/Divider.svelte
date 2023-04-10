<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let vertical = false
  export let styles = ''
</script>

<svelte:element
  this={vertical ? 'div' : 'hr'}
  class={twMerge(
    'rounded-full',
    vertical
      ? 'h-full w-px border-none bg-surface-100/25'
      : 'w-full border-surface-100/25',
    styles
  )}
/>
