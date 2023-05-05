<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore } from '@skeletonlabs/skeleton'

  import { ArrowUturnLeft } from 'svelte-hero-icons'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import IconLink from '$components/IconLink/IconLink.svelte'
  import Form from '$components/Form/Form.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import FormControl from '$components/FormControls/FormControl.svelte'

  export let data

  const sForm = superForm(data.form, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      if (type === 'success' || type === 'redirect') {
        toastStore.trigger({
          message: 'An invitation email has been sent to ' + $form.email,
          background: 'variant-filled-success'
        })
      }
    }
  })
  const { form, errors, delayed } = sForm
</script>

<svelte:head>
  <title>Invite New User | VF Columbus</title>
</svelte:head>

<PageLayout
  contentWrapperStyles="max-w-4xl"
  headerWrapperStyles="space-y-2"
>
  <svelte:fragment slot="header">
    <h1>Invite A New User</h1>
    <IconLink
      href="/users"
      label="All Users"
      iconSource={ArrowUturnLeft}
    />
  </svelte:fragment>

  <Form superForm={sForm}>
    <TextInput
      type="email"
      form={sForm}
      field="email"
      label="Email Address"
    />

    <TextInput
      form={sForm}
      field="name"
    />

    <Select
      form={sForm}
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
        class="btn variant-filled-primary">{$delayed ? 'Inviting...' : 'Invite User'}</button
      >
    </svelte:fragment>
  </Form>
</PageLayout>
