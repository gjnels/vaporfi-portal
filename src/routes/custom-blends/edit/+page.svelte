<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore, modalStore } from '@skeletonlabs/skeleton'
  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  // Components
  import { ArrowUturnLeft, ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import IconLink from '$components/IconLink/IconLink.svelte'
  import CustomBlendForm from '../CustomBlendForm.svelte'
  import DeleteModal from './DeleteModal.svelte'

  export let data
  const { flavors, blend } = data

  const updateForm = superForm(data.updateForm, {
    onResult: ({ result: { type } }) => {
      if (type === 'success' || type === 'redirect') {
        toastStore.trigger({
          message: 'Custom blend has been updated.',
          background: 'variant-filled-success'
        })
      }
    }
  })
  const { submitting } = updateForm
</script>

<svelte:head>
  <title>Edit Custom Blend | VF Columbus</title>
</svelte:head>

<PageLayout
  contentWrapperStyles="max-w-4xl"
  headerWrapperStyles="space-y-2"
>
  <svelte:fragment slot="header">
    <h1>Edit Custom Blend</h1>
    <div class="flex flex-wrap items-center gap-x-4 text-surface-700-200-token">
      <h3>{blend.name}</h3>
      <span class="text-sm md:text-base">{createDisplayBlendString(blend)}</span>
    </div>
    <IconLink
      href="/custom-blends"
      label="Back to Custom Blends"
      iconSource={ArrowUturnLeft}
    />
  </svelte:fragment>

  <div class="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
    <button
      type="button"
      class="btn variant-soft-error hover:variant-filled-error"
      on:click={() =>
        modalStore.trigger({
          type: 'component',
          component: {
            ref: DeleteModal,
            props: { blend, form: data.deleteForm }
          }
        })}
      disabled={$submitting}>Delete Custom Blend</button
    >
    <span class="flex items-center gap-2 text-warning-600 dark:text-warning-500">
      <Icon
        src={ExclamationTriangle}
        size="1.5em"
      />Warning: this cannot be undone
    </span>
  </div>

  <CustomBlendForm
    action="?/updateBlend&blend_id={blend.id}"
    {flavors}
    superForm={updateForm}
    isAdmin
  />
</PageLayout>
