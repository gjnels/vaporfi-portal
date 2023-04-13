<script lang="ts">
  import toast from 'svelte-french-toast'
  import { createDialog } from 'svelte-headlessui'
  import {
    DocumentDuplicate,
    Icon,
    PencilSquare,
    Trash
  } from 'svelte-hero-icons'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import { page } from '$app/stores'

  import { copyBlendToClipboard } from '$lib/utils/clipboard.js'
  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  import { Modal, PageLayout } from '$components'
  import FormControl from '$components/FormControl.svelte'

  export let data

  const {
    form: copyForm,
    enhance: copyEnhance,
    constraints: copyConstraints,
    errors: copyErrors
  } = superForm(data.copyForm, {
    taintedMessage: null, // don't confirm before leaving page
    onResult: ({ result: { type } }) => {
      if (type === 'success' && $currentCopyBlend) {
        copyBlendToClipboard({
          ...$currentCopyBlend,
          flavor1: $currentCopyBlend.flavor1,
          shots1: $currentCopyBlend.shots1,
          nicotine: $copyForm.nicotine,
          bottleCount: $copyForm.bottleCount
        })

        copyModal.close()
      }
    }
  })

  const {
    form: deleteForm,
    enhance: deleteEnhance,
    message: deleteMessage
  } = superForm(data.deleteForm, {
    dataType: 'json',
    taintedMessage: null, // don't confirm before leaving page
    onResult: ({ result: { type } }) => {
      if (type === 'success') {
        deleteModal.close()
        toast.success('Custom blend has been deleted.')
      } else if ($deleteMessage && $deleteMessage.type == 'error') {
        toast.error($deleteMessage.message)
      }
    }
  })

  const copyModal = createDialog({ label: 'custom_blend:copy' })
  const deleteModal = createDialog({ label: 'custom_blend:delete' })

  const currentCopyBlend = writable<(typeof data.blends)[number] | null>(null)
  const currentDeleteBlend = writable<(typeof data.blends)[number] | null>(null)

  // Reset blend stores when modals close
  $: if (!$copyModal.expanded) $currentCopyBlend = null
  $: if (!$deleteModal.expanded) $currentDeleteBlend = null
</script>

<PageLayout headerContainerStyles="justify-between">
  <svelte:fragment slot="header">
    <h1>Custom Blends</h1>
    {#if data.admin}
      <a
        href="{$page.url.pathname}/new"
        class="btn btn-small btn-primary">Make a new blend</a
      >
    {/if}
  </svelte:fragment>

  {#if data.blends.length === 0}
    <p class="text-center italic text-danger-500">No custom blends found</p>
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
          <div class="ml-auto flex items-center gap-2">
            <button
              class="btn btn-icon btn-primary"
              title="Copy this custom blend"
              on:click={() => {
                $currentCopyBlend = blend
                $copyForm = { ...$copyForm, ...blend }
                copyModal.open()
              }}
              ><Icon
                src={DocumentDuplicate}
                size="1.5rem"
                solid
              /></button
            >
            <!-- Edit and Delete actions are only available to admins -->
            {#if data.admin}
              <a
                href="{$page.url.pathname}/edit?blend_id={blend.id}"
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
                on:click={() => {
                  $currentDeleteBlend = blend
                  $deleteForm = blend
                  deleteModal.open()
                }}
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
<Modal
  modalStore={copyModal}
  modalWindowStyles="w-full max-w-lg"
>
  {#if $currentCopyBlend !== null}
    <p class="mb-6 text-center">
      <span class="block text-2xl font-semibold">{$currentCopyBlend.name}</span>
      <span>
        {createDisplayBlendString($currentCopyBlend)}
      </span>
    </p>
  {/if}

  <form
    method="post"
    action="?/copyBlend"
    class="form"
    use:copyEnhance
  >
    <FormControl
      label="Nicotine level"
      errors={$copyErrors.nicotine}
    >
      <input
        type="number"
        name="nicotine"
        bind:value={$copyForm.nicotine}
        {...$copyConstraints.nicotine}
        step="any"
      />
    </FormControl>

    <FormControl
      label="Number of bottles"
      errors={$copyErrors.bottleCount}
    >
      <input
        type="number"
        name="bottleCount"
        bind:value={$copyForm.bottleCount}
        {...$copyConstraints.bottleCount}
      />
    </FormControl>

    <div class="flex flex-wrap gap-4">
      <button
        type="submit"
        class="btn btn-primary flex-1">Copy Blend</button
      >
      <button
        type="button"
        class="btn flex-1"
        on:click={copyModal.close}>Cancel</button
      >
    </div>
  </form>
</Modal>

<!-- Delete blend modal -->
<Modal modalStore={deleteModal}>
  <p class="mb-4 text-center">Are you sure you want to delete this blend?</p>
  {#if $currentDeleteBlend !== null}
    <p class="mb-6 text-center">
      <span class="block text-xl font-semibold">{$currentDeleteBlend.name}</span
      >
      <span>
        {createDisplayBlendString($currentDeleteBlend)}
      </span>
    </p>
  {/if}
  <div class="flex w-full justify-center gap-4">
    <form
      method="post"
      use:deleteEnhance
      action="?/deleteBlend"
      class="contents"
    >
      <button
        type="submit"
        class="btn btn-danger flex-1">Yes</button
      >
    </form>
    <button
      type="button"
      class="btn flex-1"
      on:click={deleteModal.close}>No</button
    >
  </div>
</Modal>
