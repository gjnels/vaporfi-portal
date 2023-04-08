<script lang="ts">
  import { Icon, Pencil, Trash } from 'svelte-hero-icons'

  import { savedBlends, storeSavedBlends } from '$lib/stores/savedBlends'
  import type { SavedFlavorPickerBlend } from '$lib/types/flavors.types'
  import { copyBlendToClipboard } from '$lib/utils/clipboard'
  import { createBlendString } from '$lib/utils/flavors'

  import { Button } from '$components'

  export let onEdit: (blend: SavedFlavorPickerBlend) => void
  export let onDelete: (blend: SavedFlavorPickerBlend) => void
</script>

<div>
  <div class="mb-4 flex items-center justify-between gap-4">
    <h2 class="text-2xl font-semibold">Saved Blends</h2>
    <button
      type="button"
      class="btn btn-danger btn-small"
      on:click={() => {
        $savedBlends = []
        storeSavedBlends()
      }}>Clear All</button
    >
  </div>
  {#if $savedBlends.length === 0}
    <p class="font-light italic text-surface-400">No saved blends found</p>
  {:else}
    <ul class="space-y-3">
      {#each $savedBlends as blend (blend.id)}
        <li
          class="flex origin-top items-center gap-2 rounded-lg border border-transparent bg-surface-800 px-3 py-2 transition focus-within:border-surface-600 focus-within:bg-surface-950 hover:border-surface-600 hover:bg-surface-950"
        >
          <button
            class="rounded-full px-2 py-1 font-semibold text-surface-50 outline-none hover:bg-surface-800 focus-visible:ring focus-visible:ring-surface-300"
            on:click={() => copyBlendToClipboard(blend)}
            >{createBlendString(blend)}</button
          >
          <button
            class="btn btn-secondary btn-icon ml-auto"
            on:click={() => onEdit(blend)}
            ><Icon
              src={Pencil}
              size="1.5rem"
              solid
            /></button
          >
          <button
            class="btn btn-danger btn-icon"
            on:click={() => onDelete(blend)}
            ><Icon
              src={Trash}
              size="1.5rem"
              solid
            /></button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>
