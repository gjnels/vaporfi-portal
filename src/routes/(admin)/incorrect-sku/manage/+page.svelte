<script lang="ts">
  import toast from 'svelte-french-toast'
  import { createDialog } from 'svelte-headlessui'
  import { ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import { writable } from 'svelte/store'

  import { enhance } from '$app/forms'

  import { IncorrectSkuTable, Modal, PageLayout } from '$components'

  export let data
  export let form

  $: errorMessage = form?.message

  $: unfixedSkus = data.skus.filter(({ fixed }) => !fixed)
  $: fixedSkus = data.skus.filter(({ fixed }) => fixed)

  const deleteModal = createDialog({ label: 'delete incorrect sku' })
  const skuToDelete = writable<(typeof data.skus)[number] | null>(null)
  $: if (!$deleteModal.expanded) $skuToDelete = null // reset id when modal is closed

  const onDelete = (sku: (typeof data.skus)[number]) => {
    $skuToDelete = sku
    deleteModal.open()
  }
</script>

<svelte:head>
  <title>Manage Incorrect SKUs | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Manage Incorrect SKUs</h1>
  </svelte:fragment>

  <h2 class="mb-2 text-2xl font-medium">Incorrect SKUs to be Fixed</h2>
  {#if unfixedSkus.length === 0}
    <p class="text-primary-400">None found!</p>
  {:else}
    <IncorrectSkuTable
      bind:skus={unfixedSkus}
      bind:errorMessage
      {onDelete}
    />
  {/if}

  <div class="mx-auto my-10 h-0.5 w-[95%] rounded-full bg-surface-700" />

  <h2 class="mb-2 text-2xl font-medium">Fixed Incorrect SKUs</h2>
  {#if fixedSkus.length === 0}
    <p class="text-primary-400">None found!</p>
  {:else}
    <IncorrectSkuTable
      bind:skus={fixedSkus}
      bind:errorMessage
      {onDelete}
    />
  {/if}
</PageLayout>

<Modal
  modalStore={deleteModal}
  modalWindowStyles="gap-2 flex flex-col items-center"
>
  <p>Are you sure you want to delete this incorrect SKU?</p>
  <p class="grid grid-cols-[auto,_1fr] gap-x-2">
    <span>Incorrect Item:</span>
    <span>{$skuToDelete?.incorrect_item_name}</span>
    <span>Correct Item:</span>
    <span>{$skuToDelete?.correct_item_name}</span>
    <span>SKU:</span>
    <span>{$skuToDelete?.sku}</span>
    <span>Fixed:</span>
    <span class={$skuToDelete?.fixed ? 'text-primary-400' : 'text-danger-400'}
      >{$skuToDelete?.fixed ? 'Yes' : 'No'}</span
    >
  </p>

  <span class="flex items-center gap-2 text-warning-400">
    <Icon
      src={ExclamationTriangle}
      size="1.5em"
    />Warning: this cannot be undone
  </span>

  <div class="mt-4 flex gap-4 self-stretch">
    <form
      method="post"
      action="?/delete&sku_id={$skuToDelete?.id}"
      class="contents"
      use:enhance={async () => {
        return async ({ result: { type }, update }) => {
          if (type === 'success' || type === 'redirect') {
            toast.success('Incorrect SKU record has been deleted', {
              duration: 3000
            })
            deleteModal.close()
          } else if (form?.message) {
            toast.error(form.message, { duration: 3000 })
          }
          update()
        }
      }}
    >
      <button
        type="submit"
        class="btn btn-danger flex-1"
        title="Delete this record">Yes</button
      >
    </form>
    <button
      type="button"
      class="btn flex-1"
      on:click={deleteModal.close}>No</button
    >
  </div>
</Modal>
