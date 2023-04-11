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
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/80 p-4"
    transition:fade
  >
    <div
      class={twMerge(
        'relative overflow-y-scroll rounded-2xl bg-surface-700 p-10 shadow',
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
