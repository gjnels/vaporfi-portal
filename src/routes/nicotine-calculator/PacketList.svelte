<script lang="ts">
  import { createPopover } from 'svelte-headlessui'
  import { Icon, InformationCircle } from 'svelte-hero-icons'

  import PacketPopover from './PacketPopover.svelte'

  export let title: string
  export let packetPopoverContent: string | string[]

  const packetPopover = createPopover({ label: title })
</script>

<div class="mx-auto flex flex-col gap-0.5">
  <div
    class="relative flex flex-col items-center gap-1 sm:flex-row sm:items-stretch"
  >
    <div class="flex items-center gap-1 self-start">
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
    </div>
    <!-- Information popover -->
    <PacketPopover
      popover={packetPopover}
      content={packetPopoverContent}
    />
  </div>

  <!-- Packets list -->
  <slot />
</div>
