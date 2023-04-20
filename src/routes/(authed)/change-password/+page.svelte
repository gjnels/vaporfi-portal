<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'

  import { FormMessage, PageLayout } from '$components'
  import FormControl from '$components/FormControl.svelte'

  export let data

  const { form, enhance, message, errors, constraints } = superForm(data.form, {
    resetForm: true
  })
</script>

<svelte:head>
  <title>Change Password | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="max-w-4xl">
  <h1 class="mb-8 text-center text-4xl font-semibold">Change Your Password</h1>
  <form
    method="post"
    use:enhance
    class="form"
  >
    <FormControl
      label="New Password"
      errors={$errors.password}
    >
      <input
        type="password"
        name="password"
        bind:value={$form.password}
        {...$constraints.password}
      />
    </FormControl>

    <FormControl
      label="Confirm New Password"
      errors={$errors.passwordConfirm}
    >
      <input
        type="password"
        name="passwordConfirm"
        bind:value={$form.passwordConfirm}
        {...$constraints.passwordConfirm}
      />
    </FormControl>

    <div class="form-actions flex flex-wrap items-center gap-4">
      <FormMessage message={$message} />
      <button
        type="submit"
        class="btn btn-primary ml-auto">Change Password</button
      >
    </div>
  </form>
</PageLayout>
