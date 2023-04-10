<script lang="ts">
  import { createPopover } from 'svelte-headlessui'
  import { Icon, InformationCircle } from 'svelte-hero-icons'
  import { scale } from 'svelte/transition'

  export let title: string
  export let packetPopoverContent: string | string[]

  const packetPopover = createPopover({ label: title })

  const contentSections =
    typeof packetPopoverContent === 'string'
      ? packetPopoverContent.split('\n')
      : packetPopoverContent
</script>

<div class="mx-auto flex flex-col gap-0.5">
  <div class="relative flex items-center gap-1">
    <h2 class="text-lg font-medium text-surface-100">{title}</h2>
    <button
      type="button"
      class="btn btn-secondary btn-icon"
      title="View explanation"
      use:packetPopover.button
      ><Icon
        src={InformationCircle}
        size="1.25rem"
      /></button
    >
    <!-- Information popover -->
    {#if $packetPopover.expanded}
      <div
        class="absolute left-1/2 top-full z-20 mt-1 flex w-80 max-w-[calc(100vw-8px)] origin-top -translate-x-1/2 flex-col gap-2 rounded-md border border-surface-400 bg-surface-700 px-4 py-3 shadow transition sm:left-full sm:top-0 sm:ml-1 sm:mt-0 sm:origin-top-left sm:translate-x-0"
        transition:scale={{
          start: 0.75,
          duration: 200
        }}
        use:packetPopover.panel
      >
        {#each contentSections as contentSection}
          <span>{contentSection}</span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Packets list -->
  <slot />
</div>
