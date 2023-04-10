<script lang="ts">
  import type { createDialog } from 'svelte-headlessui'
  import { fade } from 'svelte/transition'

  export let modalStore: ReturnType<typeof createDialog>
</script>

{#if $modalStore.expanded}
  <div
    class="fixed inset-0 z-50 grid place-content-center bg-surface-900/80 p-4"
    transition:fade
  >
    <slot />
  </div>
{/if}
