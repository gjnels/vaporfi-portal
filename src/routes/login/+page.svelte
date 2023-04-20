<script lang="ts">
  import toast from 'svelte-french-toast'
  import { superForm } from 'sveltekit-superforms/client'

  import { page } from '$app/stores'

  import { FormControl, FormMessage, PageLayout } from '$components'

  export let data

  const { form, enhance, errors, message, constraints } = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Successfully logged in')
      }
    }
  })

  const redirectTo = $page.url.searchParams.get('redirectTo')
</script>

<svelte:head>
  <title>Log In | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="max-w-4xl">
  <h1 class="mb-8 text-center text-4xl font-semibold">Log In</h1>

  <form
    method="post"
    action="?redirectTo={$page.url.searchParams.get('redirectTo') ?? '/'}"
    class="form"
    use:enhance
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

    <FormControl
      label="Password"
      errors={$errors.password}
    >
      <input
        type="password"
        name="password"
        bind:value={$form.password}
        {...$constraints.password}
      />
    </FormControl>

    <div class="form-actions flex flex-wrap items-center gap-4">
      <FormMessage message={$message} />
      <button
        type="submit"
        class="btn btn-primary ml-auto">Log In</button
      >
    </div>
  </form>
  <a
    href="/auth/reset-password{redirectTo ? `?redirectTo=${redirectTo}` : ''}"
    class="link link-secondary mx-auto mt-8">Forgot your password?</a
  >
</PageLayout>
