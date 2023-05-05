<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'

  import { ArrowUturnLeft, ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import Form from '$components/Form/Form.svelte'
  import FormControl from '$components/FormControls/FormControl.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'
  import DeleteModal from './DeleteModal.svelte'
  import IconLink from '$components/IconLink/IconLink.svelte'

  export let data

  const updateForm = superForm(data.updateForm, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      // show toast notification letting user know the update was successful before redirecting
      if (type === 'redirect') {
        toastStore.trigger({
          message: 'User has been updated',
          background: 'variant-filled-success'
        })
      }
    }
  })

  const { form, errors, delayed } = updateForm
</script>

<svelte:head>
  <title>Edit User | VF Columbus</title>
</svelte:head>

<PageLayout
  contentWrapperStyles="max-w-4xl"
  headerWrapperStyles="space-y-2"
>
  <svelte:fragment slot="header">
    <h1>Edit User</h1>
    <IconLink
      href="/users"
      label="All Users"
      iconSource={ArrowUturnLeft}
    />
  </svelte:fragment>

  <div class="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
    <button
      type="button"
      class="btn variant-soft-error hover:variant-filled-error"
      on:click={() => {
        modalStore.trigger({
          type: 'component',
          component: {
            ref: DeleteModal,
            props: { profile: data.profile, form: data.deleteForm }
          }
        })
      }}>Delete This User</button
    >
    <span class="flex items-center gap-2 text-warning-600 dark:text-warning-500">
      <Icon
        src={ExclamationTriangle}
        size="1.5em"
      />Warning: this cannot be undone
    </span>
  </div>

  <Form
    superForm={updateForm}
    action="?/update&user_id={data.profile.id}"
  >
    <TextInput
      form={updateForm}
      field="name"
    />

    <Select
      form={updateForm}
      field="role"
    >
      <option value={null}>None</option>
      <option value={'Store'}>Store</option>
      <option value={'Manager'}>Manager</option>
      <option value={'Admin'}>Admin</option>
    </Select>

    <FormControl
      label="Locations"
      errors={$errors.locations}
    >
      <div class="flex flex-wrap gap-x-8 gap-y-2">
        {#each data.locations as location}
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={$form.locations[location.id]}
            />
            <span>{location.name}</span>
          </label>
        {/each}
      </div>
    </FormControl>

    <svelte:fragment slot="actions">
      <button
        type="submit"
        disabled={$delayed}
        class="btn variant-filled-primary">{$delayed ? 'Updating...' : 'Update User'}</button
      >
    </svelte:fragment>
  </Form>
</PageLayout>
