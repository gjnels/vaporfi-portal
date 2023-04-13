<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'

  import { page } from '$app/stores'

  import { FormMessage, PageLayout } from '$components'
  import FormControl from '$components/FormControl.svelte'

  export let data

  const { form, enhance, message, errors, constraints } = superForm(data.form, {
    resetForm: true
  })
</script>

<PageLayout contentContainerStyles="max-w-xl">
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

    <FormMessage message={$message} />

    <button
      type="submit"
      class="btn btn-primary">Change Password</button
    >
  </form>
</PageLayout>
