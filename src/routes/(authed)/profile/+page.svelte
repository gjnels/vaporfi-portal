<script lang="ts">
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import { profileUpdate } from '$lib/stores/profileUpdate.js'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import Form from '$components/Form/Form.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'

  export let data

  const nameForm = superForm(data.nameForm)
  $: ({ delayed: nameDelayed, form: nameFormStore } = nameForm)

  onMount(() => {
    $profileUpdate.external = false
    return () => {
      $profileUpdate.external = true
    }
  })
</script>

<svelte:head>
  <title>My Profile | VF Columbus</title>
</svelte:head>

<PageLayout
  headerWrapperStyles="flex flex-wrap gap-8 justify-between items-center"
  contentWrapperStyles="max-w-4xl flex flex-col gap-8"
>
  <svelte:fragment slot="header">
    <h1>My Profile</h1>
    <a
      href="/change-password"
      class="btn btn-sm variant-soft-tertiary hover:variant-filled-tertiary">Change my Password</a
    >
  </svelte:fragment>

  <Form
    superForm={nameForm}
    action="?/updateName"
  >
    <label
      for="name"
      class="flex flex-col gap-2"
    >
      <h3>My Name</h3>
      <span class="text-sm text-surface-600-300-token"
        >Enter your name you wish to display. Leave blank to remove your name from your profile.</span
      >
      <TextInput
        form={nameForm}
        field="name"
        label={false}
        required={false}
      />
    </label>

    <svelte:fragment slot="actions">
      <button
        type="submit"
        class="btn variant-filled-primary"
        disabled={$nameDelayed || $nameFormStore.name === data.profile.name}
        >{$nameDelayed ? 'Updating...' : 'Update Name'}</button
      >
    </svelte:fragment>
  </Form>
</PageLayout>
