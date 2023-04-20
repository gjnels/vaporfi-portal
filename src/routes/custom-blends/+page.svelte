<script lang="ts">
  import { createDialog } from 'svelte-headlessui'
  import { DocumentDuplicate, Icon, PencilSquare } from 'svelte-hero-icons'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import { page } from '$app/stores'

  import { copyBlendToClipboard } from '$lib/utils/clipboard.js'
  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  import { Modal, PageLayout } from '$components'
  import FormControl from '$components/FormControl.svelte'

  export let data

  $: isAdmin = data.currentProfile?.role === 'Admin'
  $: isManager = isAdmin || data.currentProfile?.role === 'Manager'

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
          nicotine: $copyForm.nicotine,
          bottleCount: $copyForm.bottleCount
        })

        copyModal.close()
      }
    }
  })

  const copyModal = createDialog({ label: 'custom_blend:copy' })

  const currentCopyBlend = writable<(typeof data.blends)[number] | null>(null)

  // Reset blend stores when modals close
  $: if (!$copyModal.expanded) $currentCopyBlend = null

  let blendSearchTerms = ''
  $: filteredBlends = data.blends.filter((blend) =>
    blendSearchTerms.trim().length > 0
      ? blendSearchTerms
          .trim()
          .toLowerCase()
          .split(' ')
          .every(
            (term) =>
              blend.name.toLowerCase().includes(term) ||
              blend.flavor1.flavor.toLowerCase().includes(term) ||
              blend.flavor2?.flavor.toLowerCase().includes(term) ||
              blend.flavor3?.flavor.toLowerCase().includes(term)
          )
      : true
  )
</script>

<svelte:head>
  <title>Custom Blends | VF Columbus</title>
</svelte:head>

<PageLayout headerContainerStyles="flex-col items-stretch">
  <h1 slot="header">Custom Blends</h1>

  {#if data.blends.length === 0}
    <p class="text-center italic text-danger-500">No custom blends found</p>
  {:else}
    <div class="mb-8 flex w-full flex-wrap justify-center gap-4">
      <!-- svelte-ignore a11y-autofocus -->
      <input
        type="search"
        bind:value={blendSearchTerms}
        class="grow"
        placeholder="Search for custom blends"
      />
      {#if isAdmin || isManager}
        <a
          href="{$page.url.pathname}/new"
          class="btn btn-small btn-primary">Make a new blend</a
        >
      {/if}
    </div>

    {#if filteredBlends.length === 0}
      <p class="text-center italic text-danger-400">
        No custom blends match your search terms
      </p>
    {:else}
      <ul class="space-y-2">
        {#each filteredBlends as blend (blend.id)}
          <li
            class="flex flex-wrap items-center gap-4 rounded-xl border bg-surface-800 px-4 py-3 transition focus-within:bg-surface-950 hover:bg-surface-950 {blend.approved
              ? 'border-transparent focus-within:border-surface-600 hover:border-surface-600'
              : 'border-red-500'}"
          >
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span
                class="text-lg font-medium {blend.approved
                  ? 'text-primary-300'
                  : 'text-danger-300'}">{blend.name}</span
              >
              <span>{createDisplayBlendString(blend)}</span>
            </div>
            {#if !blend.approved}
              <p class="text-red-500">Not approved</p>
            {/if}
            <div class="ml-auto flex items-center gap-2">
              <button
                type="button"
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
              {#if isAdmin}
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
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
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
    class="flex flex-col gap-6"
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

    <div class="ml-auto flex flex-wrap gap-4">
      <button
        type="submit"
        class="btn btn-primary">Copy Blend</button
      >
      <button
        type="button"
        class="btn"
        on:click={copyModal.close}>Cancel</button
      >
    </div>
  </form>
</Modal>
