<script lang="ts">
  import type { createDialog } from 'svelte-headlessui'
  import { Icon, XMark } from 'svelte-hero-icons'
  import { fade, scale } from 'svelte/transition'
  import { twMerge } from 'tailwind-merge'

  export let modalStore: ReturnType<typeof createDialog>
  export let modalWindowStyles = ''
</script>

{#if $modalStore.expanded}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/90 p-4"
    transition:fade
  >
    <div
      class={twMerge(
        'relative overflow-auto rounded-2xl border border-surface-600 bg-surface-800 p-10 shadow',
        modalWindowStyles
      )}
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
