<script lang="ts">
  import { page } from '$app/stores'
  import { superForm } from 'sveltekit-superforms/client'

  // Components
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import Form from '$components/Form/Form.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'

  export let data

  const sForm = superForm(data.form)
  const redirectTo = $page.url.searchParams.get('redirectTo')
</script>

<svelte:head>
  <title>Reset Password | VF Columbus</title>
</svelte:head>

<PageLayout contentWrapperStyles="max-w-2xl">
  <svelte:fragment slot="header">
    <h1 class="text-center">Reset Your Password</h1>
  </svelte:fragment>

  <Form superForm={sForm}>
    <!-- Email input field -->
    <TextInput
      form={sForm}
      field="email"
    />

    <svelte:fragment slot="actions">
      <button
        type="submit"
        class="btn variant-filled-primary">Send Reset Link</button
      >
    </svelte:fragment>
  </Form>

  <!-- Link to login page -->
  <div class="mx-auto mt-8 flex flex-col items-center">
    <p>Remember your password?</p>
    <a href="/login{redirectTo ? `?redirectTo=${redirectTo}` : ''}">Login to your account</a>
  </div>
</PageLayout>
