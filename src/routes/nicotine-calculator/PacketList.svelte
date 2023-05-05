<script lang="ts">
  import { popup } from '@skeletonlabs/skeleton'

  export let title: string
  export let packetPopoverContent: string
</script>

<div
  class="card h-fit overflow-hidden bg-surface-50-900-token border-token border-surface-300-600-token"
>
  <div class="space-y-2 px-6 py-3">
    <h3 use:popup={{ event: 'hover', target: 'packet_list_info', placement: 'top' }}>
      {title}
    </h3>
    <div
      class="card variant-filled max-w-md p-3 text-sm shadow-xl"
      data-popup="packet_list_info"
    >
      <div class="flex flex-col gap-2">{@html packetPopoverContent}</div>
      <!-- Arrow -->
      <div class="arrow variant-filled" />
    </div>
    <!-- Packets list -->
    <slot />
  </div>

  {#if $$slots.actions}
    <div
      class="flex flex-wrap justify-end gap-3 !border-x-0 !border-b-0 px-6 py-3 bg-surface-100-800-token border-token border-surface-300-600-token"
    >
      <slot name="actions" />
    </div>
  {/if}
</div>
