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
    <Button
      color="red"
      small
      onclick={() => {
        $savedBlends = []
        storeSavedBlends()
      }}>Clear All</Button
    >
  </div>
  {#if $savedBlends.length === 0}
    <p class="font-light italic text-zinc-400">No saved blends found</p>
  {:else}
    <ul class="space-y-3">
      {#each $savedBlends as blend (blend.id)}
        <li
          class="flex origin-top items-center gap-2 rounded-lg border border-transparent bg-zinc-900 p-2 transition hover:border-zinc-700 hover:bg-zinc-950"
        >
          <Button
            transparent
            styles="text-left px-2 py-1"
            onclick={() => copyBlendToClipboard(blend)}
            >{createBlendString(blend)}</Button
          >
          <Button
            icon
            color="green"
            transparent
            styles="ml-auto"
            onclick={() => onEdit(blend)}
            ><Icon
              src={Pencil}
              size="1.5rem"
              solid
            /></Button
          >
          <Button
            icon
            color="red"
            transparent
            onclick={() => onDelete(blend)}
            ><Icon
              src={Trash}
              size="1.5rem"
              solid
            /></Button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>
