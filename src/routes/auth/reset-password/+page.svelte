<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'

  import { page } from '$app/stores'

  import { FormControl, FormMessage } from '$components'
  import PageLayout from '$components/PageLayout.svelte'

  export let data

  const { form, enhance, errors, message, constraints } = superForm(data.form)

  const redirectTo = $page.url.searchParams.get('redirectTo')
</script>

<svelte:head>
  <title>Reset Password | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="max-w-4xl">
  <h2 class="mb-8 text-center text-4xl font-semibold">Reset Your Password</h2>
  <form
    method="post"
    use:enhance
    class="form"
  >
    <FormControl
      label="Email address"
      errors={$errors.email}
    >
      <input
        type="email"
        name="email"
        bind:value={$form.email}
        {...$constraints.email}
      />
    </FormControl>

    <div class="form-actions flex flex-wrap items-center gap-4">
      <FormMessage message={$message} />
      <button
        type="submit"
        class="btn btn-primary ml-auto">Send Reset Link</button
      >
    </div>
  </form>

  <div class="mx-auto mt-8 flex flex-col items-center">
    <p>Remember your password?</p>
    <a
      href="/login{redirectTo ? `?redirectTo=${redirectTo}` : ''}"
      class="link link-secondary">Login to your account</a
    >
  </div>
</PageLayout>
