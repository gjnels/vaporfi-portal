<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'

  // Components
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import Form from '$components/Form/Form.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'

  export let data

  const sForm = superForm(data.form, {
    resetForm: true
  })
</script>

<svelte:head>
  <title>Change Password | VF Columbus</title>
</svelte:head>

<PageLayout contentWrapperStyles="max-w-4xl">
  <svelte:fragment slot="header">
    <h1>Change Your Password</h1>
  </svelte:fragment>

  <Form superForm={sForm}>
    <TextInput
      form={sForm}
      field="password"
      label="New Password"
      type="password"
    />

    <TextInput
      form={sForm}
      field="passwordConfirm"
      label="Confirm New Password"
      type="password"
    />

    <svelte:fragment slot="actions">
      <button
        type="submit"
        class="btn variant-filled-primary">Change Password</button
      >
    </svelte:fragment>
  </Form>
</PageLayout>
