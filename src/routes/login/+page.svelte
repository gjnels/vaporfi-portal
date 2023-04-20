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

<PageLayout contentContainerStyles="max-w-xl">
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

    <FormMessage message={$message} />

    <button
      type="submit"
      class="btn btn-primary">Log In</button
    >

    <a
      href="password/reset{redirectTo ? `?redirectTo=${redirectTo}` : ''}"
      class="link link-secondary self-center text-lg">Forgot your password?</a
    >
  </form>
</PageLayout>
