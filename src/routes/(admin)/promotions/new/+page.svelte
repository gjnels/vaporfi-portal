<script lang="ts">
  import { dateProxy, superForm } from 'sveltekit-superforms/client'
  import { toastStore } from '@skeletonlabs/skeleton'

  import { ArrowUturnLeft } from 'svelte-hero-icons'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import IconLink from '$components/IconLink/IconLink.svelte'
  import Form from '$components/Form/Form.svelte'
  import FormControl from '$components/FormControls/FormControl.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'
  import Textarea from '$components/FormControls/Textarea.svelte'
  import Select from '$components/FormControls/Select.svelte'

  export let data

  const sForm = superForm(data.form, {
    onResult: ({ result: { type } }) => {
      if (type === 'redirect') {
        toastStore.trigger({
          message: 'Promotion has been created.',
          background: 'variant-filled-success'
        })
      }
    }
  })

  const { form: formStore, errors, constraints } = sForm

  const validFromProxy = dateProxy(formStore, 'valid_from', {
    format: 'datetime-local'
  })
  const validUntilProxy = dateProxy(formStore, 'valid_until', {
    format: 'datetime-local'
  })

  const getInitialRows = (str: string | null | undefined) => {
    if (!str) return 0
    const rows = (str.match(/\n/g) || '').length + 1
    return rows > 3 ? rows : 3
  }
</script>

<svelte:head>
  <title>Create New Promotion | VF Columbus</title>
</svelte:head>

<PageLayout
  contentWrapperStyles="max-w-4xl"
  headerWrapperStyles="space-y-2"
>
  <svelte:fragment slot="header">
    <h1>Create New Promotion</h1>
    <IconLink
      href="/promotions"
      label="All Promotions"
      iconSource={ArrowUturnLeft}
    />
  </svelte:fragment>

  <Form superForm={sForm}>
    <!-- Title -->
    <TextInput
      form={sForm}
      field="title"
    />

    <!-- Subtitle -->
    <TextInput
      form={sForm}
      field="subtitle"
    />

    <!-- Custom Blend -->
    <Select
      form={sForm}
      field="custom_blend_id"
      label="Custom Blend"
    >
      <option value={null}>None</option>
      {#each data.customBlends as blend (blend.id)}
        <option value={blend.id}>{blend.name}</option>
      {/each}
    </Select>

    <!-- Sale -->
    <Textarea
      form={sForm}
      field="sale"
    />

    <!-- Active Dates -->
    <div class="flex flex-wrap gap-4 [&>*]:flex-1">
      <FormControl
        label="Valid From"
        errors={$errors.valid_from}
      >
        <input
          type="datetime-local"
          class="input"
          name="valid_from"
          bind:value={$validFromProxy}
          data-invalid={$errors.valid_from}
          {...$constraints.valid_from}
        />
      </FormControl>
      <FormControl
        label="Valid Until"
        errors={$errors.valid_until}
      >
        <input
          type="datetime-local"
          class="input"
          name="valid_until"
          bind:value={$validUntilProxy}
          data-invalid={$errors.valid_until}
          {...$constraints.valid_until}
        />
      </FormControl>
    </div>

    <!-- Details -->
    <Textarea
      form={sForm}
      field="details"
    />

    <!-- Notes -->
    <Textarea
      form={sForm}
      field="notes"
    />

    <svelte:fragment slot="actions">
      <button
        type="submit"
        class="btn variant-filled-primary">Create Promotion</button
      >
    </svelte:fragment>
  </Form>
</PageLayout>
