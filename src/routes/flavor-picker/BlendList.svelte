<script lang="ts">
  import type { SavedFlavorPickerBlend } from '$lib/types/flavors.types'
  import { savedBlends, storeSavedBlends } from '$lib/stores/savedBlends'
  import { copyBlendToClipboard } from '$lib/utils/clipboard'
  import { createBlendString } from '$lib/utils/flavors'
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton'

  export let onEdit: (blend: SavedFlavorPickerBlend) => void
  export let onDelete: (blend: SavedFlavorPickerBlend) => void
  export let onClear: () => void

  let tooltip: PopupSettings = {
    event: 'hover',
    target: 'savedBlendTooltip',
    placement: 'top'
  }
</script>

<div>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
    <h3 use:popup={tooltip}>Saved Blends</h3>
    <div
      class="card variant-filled-surface p-2 text-center text-sm shadow-xl"
      data-popup={tooltip.target}
    >
      Click a saved blend to copy it to your clipboard.
      <!-- Arrow -->
      <div class="arrow variant-filled-surface" />
    </div>
    <button
      type="button"
      class="btn btn-sm variant-soft hover:variant-filled-error"
      on:click={() => {
        $savedBlends = []
        storeSavedBlends()
        onClear()
      }}>Clear All</button
    >
  </div>
  {#if $savedBlends.length === 0}
    <p class="font-light italic text-surface-400">No saved blends found</p>
  {:else}
    <ul class="space-y-3">
      {#each $savedBlends as blend (blend.id)}
        <li
          class="card card-hover flex flex-wrap items-center gap-x-6 gap-y-1 px-3 py-2 border-token border-surface-300-600-token hover:brightness-105 dark:hover:brightness-[1.15]"
        >
          <button
            type="button"
            class="btn btn-sm text-base hover:variant-soft"
            on:click={() => copyBlendToClipboard(blend)}>{createBlendString(blend)}</button
          >
          <div class="ml-auto flex items-center gap-x-3">
            <button
              type="button"
              class="btn btn-sm variant-soft-tertiary hover:variant-filled-tertiary"
              on:click={() => onEdit(blend)}>Edit</button
            >
            <button
              type="button"
              class="btn btn-sm variant-soft-error hover:variant-filled-error"
              on:click={() => onDelete(blend)}>Delete</button
            >
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
