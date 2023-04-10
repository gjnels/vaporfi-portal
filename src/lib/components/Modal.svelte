<script lang="ts">
  import type { createDialog } from 'svelte-headlessui'
  import { Icon, XMark } from 'svelte-hero-icons'
  import { fade, scale } from 'svelte/transition'

  export let modalStore: ReturnType<typeof createDialog>
</script>

{#if $modalStore.expanded}
  <div
    class="fixed inset-0 z-50 grid place-content-center bg-surface-900/80 p-4"
    transition:fade
  >
    <div
      class="relative rounded-2xl bg-surface-700 p-10 shadow"
      transition:scale
      use:modalStore.modal
    >
      <button
        type="button"
        class="btn btn-icon btn-secondary absolute right-1.5 top-1.5"
        on:click={modalStore.close}
      >
        <Icon
          src={XMark}
          size="1.25rem"
          class="stroke-2"
        />
      </button>
      <slot />
    </div>
  </div>
{/if}
