<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let title = ''
  export let styles = ''
</script>

<h1 class={twMerge('text-4xl font-semibold text-zinc-200', styles)}>
  {#if $$slots.title}
    <slot name="title" />
  {:else}
    {title}
  {/if}
</h1>
