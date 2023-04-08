<script lang="ts">
  import type { createPopover } from 'svelte-headlessui'
  import { scale } from 'svelte/transition'

  export let popover: ReturnType<typeof createPopover>
  export let content: string | string[]

  const contentSections =
    typeof content === 'string' ? content.split('\n') : content
</script>

{#if $popover.expanded}
  <div
    class="absolute z-20 mt-8 flex w-80 max-w-[calc(100vw_-_32px)] origin-top flex-col gap-2 rounded-md border border-surface-400 bg-surface-700 px-4 py-3 shadow sm:left-full sm:ml-1 sm:mt-0 sm:origin-top-left"
    transition:scale={{
      start: 0.75,
      duration: 200
    }}
    use:popover.panel
  >
    {#each contentSections as contentSection}
      <span>{contentSection}</span>
    {/each}
  </div>
{/if}
