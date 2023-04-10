<script lang="ts">
  import toast from 'svelte-french-toast'
  import { superForm } from 'sveltekit-superforms/client'

  import { page } from '$app/stores'

  import { FormControl, PageLayout } from '$components'

  export let data

  const { form, enhance, errors, message, constraints } = superForm(data.form, {
    dataType: 'json',
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
    action="/auth?/signin&redirectTo={$page.url.searchParams.get(
      'redirectTo'
    ) ?? '/'}"
    class="form"
    use:enhance
  >
    <FormControl
      label="Email address"
      errors={$errors.email}
    >
      <input
        type="email"
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
        bind:value={$form.password}
        {...$constraints.password}
      />
    </FormControl>

    {#if $message}
      <span class="form-error">{$message}</span>
    {/if}

    <button
      type="submit"
      class="btn btn-primary">Log In</button
    >

    <a
      href="/auth/reset-password{redirectTo ? `?redirectTo=${redirectTo}` : ''}"
      class="link link-secondary self-center">Forgot your password?</a
    >
  </form>
</PageLayout>
