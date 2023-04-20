<script lang="ts">
  import toast from 'svelte-french-toast'
  import { createDialog } from 'svelte-headlessui'
  import { ArrowUturnLeft, ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import { superForm } from 'sveltekit-superforms/client'

  import { enhance } from '$app/forms'

  import { Modal, PageLayout } from '$components'

  import PromoForm from '../PromoForm.svelte'

  export let data
  export let form

  const superform = superForm(data.updateForm, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      if (type === 'success' || type === 'redirect') {
        deleteModal.close()
        toast.success('Promotion updated successfully.')
      }
    }
  })

  const deleteModal = createDialog({ label: 'delete_promotion' })
</script>

<svelte:head>
  <title>Edit Promotion | VF Columbus</title>
</svelte:head>

<PageLayout
  contentContainerStyles="max-w-4xl"
  headerContainerStyles="max-w-4xl"
>
  <svelte:fragment slot="header">
    <h1>Edit Promotion | {data.promo.title}</h1>
    <a
      href="/promotions"
      class="link link-primary"
    >
      <Icon
        src={ArrowUturnLeft}
        size="1em"
      />
      All Promotions
    </a>
  </svelte:fragment>

  <div class="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
    <button
      type="button"
      class="btn btn-danger"
      on:click={deleteModal.open}>Delete Promotion</button
    >
    <span class="flex items-center gap-2 text-warning-400">
      <Icon
        src={ExclamationTriangle}
        size="1.5em"
      />Warning: this cannot be undone
    </span>
  </div>

  <PromoForm
    action="?/updatePromo&promo_id={data.promo.id}"
    {superform}
    customBlends={data.customBlends}
  />
</PageLayout>

<Modal
  modalStore={deleteModal}
  modalWindowStyles="flex flex-col gap-4 items-center"
>
  <span>Are you sure you want to delete this promotion?</span>

  <span class="text-2xl font-semibold">{data.promo.title}</span>

  <span class="flex items-center gap-2 text-warning-400">
    <Icon
      src={ExclamationTriangle}
      size="1.5em"
    />Warning: this cannot be undone
  </span>

  <div class="flex flex-wrap justify-center gap-4">
    <form
      method="post"
      action="?/deletePromo&promo_id={data.promo.id}"
      class="contents"
      use:enhance={async () => {
        return async ({ result, update }) => {
          if (result.type === 'success' || result.type === 'redirect') {
            toast.success('Promotion has been deleted.')
            deleteModal.close()
            update()
          }
        }
      }}
    >
      <button
        type="submit"
        class="btn btn-danger">Delete Promotion</button
      >
    </form>
    <button
      type="button"
      class="btn btn-secondary"
      on:click={deleteModal.close}>Cancel</button
    >
  </div>

  {#if form?.deleteError}
    <span class="text-lg font-medium text-danger-500">{form.deleteError}</span>
  {/if}
</Modal>
