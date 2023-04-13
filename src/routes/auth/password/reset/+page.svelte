<script lang="ts">
  import toast from 'svelte-french-toast'
  import { superForm } from 'sveltekit-superforms/client'

  import { page } from '$app/stores'

  import { FormControl, FormMessage } from '$components'
  import PageLayout from '$components/PageLayout.svelte'

  export let data

  const { form, enhance, errors, message, constraints } = superForm(data.form)

  const redirectTo = $page.url.searchParams.get('redirectTo')
</script>

<svelte:head>
  <title>Reset your password | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="max-w-lg mt-8">
  <h2 class="mb-8 text-center text-3xl font-bold">Reset Your Password</h2>
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

    <FormMessage message={$message} />

    <button
      type="submit"
      class="btn btn-primary">Send Reset Link</button
    >

    <div class="flex flex-col items-center">
      <p>Remember your password?</p>
      <a
        href="/auth/login{redirectTo ? `?redirectTo=${redirectTo}` : ''}"
        class="link link-secondary">Login to your account</a
      >
    </div>
  </form>
</PageLayout>
