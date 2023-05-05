<script lang="ts">
  import type { CustomBlend } from '$lib/types/flavors.types'
  import type { Validation } from 'sveltekit-superforms/index'
  import type { copyCustomBlendSchema } from '$lib/schemas/customBlends'
  import { createDisplayBlendString } from '$lib/utils/flavors'
  import { modalStore } from '@skeletonlabs/skeleton'

  // Components
  import CopyModal from './CopyModal.svelte'

  export let blends: CustomBlend[]
  export let isAdmin: boolean
  export let form: Validation<typeof copyCustomBlendSchema>
</script>

<ul class="space-y-3">
  {#each blends as blend (blend.id)}
    <li
      class="card card-hover flex flex-wrap items-center gap-x-6 gap-y-1 px-3 py-2 border-token hover:brightness-105 dark:hover:brightness-[1.15] {blend.approved
        ? 'border-surface-300-600-token'
        : 'border-error-500'}"
    >
      <!-- Blend name and flavors -->
      <div class="flex flex-auto flex-wrap items-center gap-x-4">
        <h4>{blend.name}</h4>
        <span class="text-surface-700-200-token">{createDisplayBlendString(blend)}</span>
      </div>

      <!-- Copy and edit buttons -->
      <div class="ml-auto flex gap-x-3">
        <button
          type="button"
          class="btn btn-sm variant-soft-secondary hover:variant-filled-secondary"
          on:click={() => {
            modalStore.trigger({
              type: 'component',
              component: {
                ref: CopyModal,
                props: { blend, form }
              }
            })
          }}>Copy</button
        >
        {#if isAdmin}
          <a
            href="/custom-blends/edit?blend_id={blend.id}"
            class="btn btn-sm variant-soft-tertiary hover:variant-filled-tertiary">Edit</a
          >
        {/if}
      </div>
    </li>
  {/each}
</ul>
