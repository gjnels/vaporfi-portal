<script lang="ts">
  import { ArrowUturnLeft } from 'svelte-hero-icons'
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton'

  // Components
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import IconLink from '$components/IconLink/IconLink.svelte'
  import CustomBlendForm from '../CustomBlendForm.svelte'

  export let data
  $: ({ flavors, isAdmin } = data)

  const adminToast: ToastSettings = {
    message: 'Custom blend has been created.',
    background: 'variant-filled-success'
  }
  const managerToast: ToastSettings = {
    message: 'Custom blend has been created. Awaiting approval...',
    background: 'variant-filled-warning'
  }

  const form = superForm(data.form, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      if (type === 'success' || type === 'redirect') {
        toastStore.trigger(isAdmin ? adminToast : managerToast)
      }
    }
  })
</script>

<svelte:head>
  <title>Create New Custom Blend | VF Columbus</title>
</svelte:head>

<PageLayout contentWrapperStyles="max-w-4xl">
  <svelte:fragment slot="header">
    <h1>Create New Custom Blend</h1>
    <IconLink
      href="/custom-blends"
      classes="mt-4"
      label="Back to Custom Blends"
      iconSource={ArrowUturnLeft}
    />
  </svelte:fragment>

  <CustomBlendForm
    superForm={form}
    {flavors}
    {isAdmin}
  />
</PageLayout>
