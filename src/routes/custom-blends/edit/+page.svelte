<script lang="ts">
  import toast from 'svelte-french-toast'
  import { createDialog } from 'svelte-headlessui'
  import { ArrowUturnLeft, ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import { superForm } from 'sveltekit-superforms/client'

  import { Modal, PageLayout } from '$components'
  import FormMessage from '$components/FormMessage.svelte'

  import CustomBlendForm from '../CustomBlendForm.svelte'

  export let data
  $: ({ flavors, blend } = data)

  const superform = superForm(data.updateForm, {
    dataType: 'json',
    onResult: ({ result: { type }, cancel }) => {
      if (type === 'success' || type === 'redirect') {
        toast.success('Custom blend has been updated.')
      }
    }
  })

  const { enhance: deleteEnhance, message: deleteMessage } = superForm(
    data.deleteForm,
    {
      dataType: 'json',
      onResult: ({ result: { type }, cancel }) => {
        if (type === 'success' || type === 'redirect') {
          deleteModal.close()
          toast.success('Custom blend has been deleted.')
        }
      }
    }
  )

  const deleteModal = createDialog({ label: 'delete blend' })
</script>

<svelte:head>
  <title>Edit Custom Blend | VF Columbus</title>
</svelte:head>

<PageLayout
  contentContainerStyles="max-w-4xl"
  headerContainerStyles="max-w-4xl"
>
  <svelte:fragment slot="header">
    <h1>Edit Custom Blend</h1>
    <a
      href="/custom-blends"
      class="link link-primary"
    >
      <Icon
        src={ArrowUturnLeft}
        size="1em"
      />
      Back to Custom Blends
    </a>
  </svelte:fragment>

  <div class="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
    <button
      type="button"
      class="btn btn-danger"
      on:click={deleteModal.open}>Delete Custom Blend</button
    >
    <span class="flex items-center gap-2 text-warning-400">
      <Icon
        src={ExclamationTriangle}
        size="2em"
      />Warning: this cannot be undone
    </span>
  </div>

  <CustomBlendForm
    action="?/updateBlend&blend_id={blend.id}"
    {flavors}
    {superform}
    isAdmin
  />
</PageLayout>

<Modal
  modalStore={deleteModal}
  modalWindowStyles="flex flex-col gap-4 items-center"
>
  <span>Are you sure you want to delete this custom blend?</span>
  <span class="text-2xl font-semibold">{blend.name}</span>
  <span class="flex items-center gap-2 text-warning-400">
    <Icon
      src={ExclamationTriangle}
      size="2em"
    />Warning: this cannot be undone
  </span>
  <div class="flex flex-wrap justify-center gap-4">
    <form
      method="post"
      action="?/deleteBlend&blend_id={blend.id}"
      class="contents"
      use:deleteEnhance
    >
      <button
        type="submit"
        class="btn btn-danger">Delete Custom Blend</button
      >
    </form>
    <button
      type="button"
      class="btn btn-secondary"
      on:click={deleteModal.close}>Cancel</button
    >
  </div>
  <FormMessage message={$deleteMessage} />
</Modal>
