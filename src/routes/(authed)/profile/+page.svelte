<script lang="ts">
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'

  import { profileUpdate } from '$lib/stores/profileUpdate.js'

  import { FormControl, FormMessage, PageLayout } from '$components'

  export let data

  const { form, enhance, message, errors, constraints, delayed } = superForm(
    data.form
  )

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
  headerContainerStyles="max-w-4xl justify-between"
  contentContainerStyles="max-w-4xl flex flex-col gap-8"
>
  <svelte:fragment slot="header">
    <h1>My Profile</h1>
    <a
      href="/change-password"
      class="btn btn-secondary btn-small">Change my Password</a
    >
  </svelte:fragment>

  <form
    method="post"
    action="?/updateName"
    class="form"
    use:enhance
  >
    <div class="flex flex-col gap-2 p-4">
      <label
        for="name"
        class="text-2xl font-medium">My Name</label
      >
      <span class="text-sm text-surface-300"
        >Enter your name you wish to display. Leave blank to remove your name
        from your profile.</span
      >
      <FormControl errors={$errors.name}>
        <input
          type="text"
          name="name"
          id="name"
          bind:value={$form.name}
          {...$constraints.name}
          required={false}
          class="grow"
        />
      </FormControl>
    </div>

    <div class="form-actions flex flex-wrap items-center gap-4">
      <FormMessage message={$message} />
      <button
        type="submit"
        class="btn btn-primary btn-small ml-auto"
        disabled={$delayed || $form.name === data.profile.name}
        >{$delayed ? 'Updating...' : 'Update Name'}</button
      >
    </div>
  </form>
</PageLayout>
