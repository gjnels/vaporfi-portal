<script lang="ts">
  import { createDialog } from 'svelte-headlessui'
  import {
    DocumentDuplicate,
    Icon,
    PencilSquare,
    Trash
  } from 'svelte-hero-icons'
  import { scale } from 'svelte/transition'

  import { page } from '$app/stores'

  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  import { Modal, PageLayout } from '$components'

  export let data

  const copyModal = createDialog({ label: 'custom_blend:copy' })
  const deleteModal = createDialog({ label: 'custom_blend:delete' })
</script>

<svelte:head>
  <title>Custom Blends | VF Columbus</title>
</svelte:head>

<PageLayout>
  <h1 slot="header">Custom Blends</h1>

  {#if data.blends.length === 0}
    <p class="italic text-danger-500">No custom blends found</p>
  {:else}
    <ul class="space-y-2">
      {#each data.blends as blend (blend.id)}
        <li
          class="flex flex-wrap items-center gap-4 rounded-xl border border-transparent bg-surface-800 px-4 py-3 transition focus-within:border-surface-600 focus-within:bg-surface-950 hover:border-surface-600 hover:bg-surface-950"
        >
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span class="text-lg font-medium text-primary-300"
              >{blend.name}</span
            >
            <span>{createDisplayBlendString(blend)}</span>
          </div>
          <div class="ml-auto flex items-center gap-4">
            <button
              class="btn btn-icon btn-primary"
              title="Copy this custom blend"
              on:click={copyModal.open}
              ><Icon
                src={DocumentDuplicate}
                size="1.5rem"
                solid
              /></button
            >
            {#if data.admin}
              <a
                href="{$page.url.pathname}/{blend.id}"
                class="btn btn-icon btn-secondary"
                title="Edit this custom blend"
                ><Icon
                  src={PencilSquare}
                  size="1.5rem"
                  solid
                /></a
              >
              <button
                class="btn btn-icon btn-danger"
                title="Delete this custom blend"
                on:click={deleteModal.open}
                ><Icon
                  src={Trash}
                  size="1.5rem"
                  solid
                /></button
              >
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</PageLayout>

<!-- Copy blend modal -->
<Modal modalStore={copyModal}>
  <p>Copy this blend</p>
</Modal>

<!-- Delete blend modal -->
<Modal modalStore={deleteModal}>
  <p>Delete this blend</p>
</Modal>
