<script lang="ts">
  import { page } from '$app/stores'
  import { superForm } from 'sveltekit-superforms/client'

  // Components
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import Form from '$lib/components/Form/Form.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'
  import { toastStore } from '@skeletonlabs/skeleton'

  export let data

  const sForm = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'redirect' || result.type === 'success') {
        toastStore.trigger({
          message: 'Successfully logged in',
          background: 'variant-filled-success'
        })
      }
    }
  })
  const redirectTo = $page.url.searchParams.get('redirectTo')
</script>

<svelte:head>
  <title>Log In | VF Columbus</title>
</svelte:head>

<PageLayout contentWrapperStyles="max-w-2xl">
  <svelte:fragment slot="header">
    <h1 class="text-center">Log In</h1>
  </svelte:fragment>

  <Form
    method="post"
    action="?redirectTo={$page.url.searchParams.get('redirectTo') ?? '/'}"
    superForm={sForm}
  >
    <TextInput
      form={sForm}
      field="email"
    />

    <TextInput
      form={sForm}
      field="password"
      type="password"
    />

    <svelte:fragment slot="actions">
      <button
        type="submit"
        class="btn variant-filled-primary">Log In</button
      >
    </svelte:fragment>
  </Form>

  <a
    href="/auth/reset-password{redirectTo ? `?redirectTo=${redirectTo}` : ''}"
    class="mx-auto mt-8 block w-fit">Forgot your password?</a
  >
</PageLayout>
