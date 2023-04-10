<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let vertical = false
  export let styles = ''
</script>

<svelte:element
  this={vertical ? 'div' : 'hr'}
  class={twMerge(
    'rounded-full border-surface-100/25',
    vertical ? 'h-full border ' : 'w-full',
    styles
  )}
/>
