<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let vertical = false
  export let styles = ''
</script>

<div
  class={twMerge(
    'block rounded-full bg-zinc-100/25',
    vertical ? 'w-px' : 'h-px',
    styles
  )}
/>
