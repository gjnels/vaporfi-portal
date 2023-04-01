<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let title = ''
</script>

<h1 class={twMerge('text-4xl font-semibold')}>
  {#if $$slots.title}
    <slot name="title" />
  {:else}
    {title}
  {/if}
</h1>
