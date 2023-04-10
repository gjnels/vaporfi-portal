<script lang="ts">
  import { page } from '$app/stores'
  import { superForm } from 'sveltekit-superforms/client'

  import { FormControl } from '$components'
  import PageLayout from '$components/PageLayout.svelte'

  export let data

  const { form, enhance, errors, message, constraints } = superForm(data.form)

  const redirectTo = $page.url.searchParams.get('redirectTo')
</script>

<PageLayout contentContainerStyles="max-w-lg mt-8">
  <h2 class="mb-8 text-center text-3xl font-bold">Reset Your Password</h2>
  <form
    method="post"
    action="/auth?/reset_password"
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

    {#if $message}
      <span class="form-error">{$message}</span>
    {/if}

    <button
      type="submit"
      class="btn btn-primary">Send Reset Link</button
    >

    <div class="text-center">
      <p>Remember your password?</p>
      <a
        href="/auth/login{redirectTo ? `?redirectTo=${redirectTo}` : ''}"
        class="link link-secondary">Login to your account</a
      >
    </div>
  </form>
</PageLayout>
