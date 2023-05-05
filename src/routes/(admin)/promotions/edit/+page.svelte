<script lang="ts">
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { dateProxy, superForm } from 'sveltekit-superforms/client'

  import { ArrowUturnLeft, ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import IconLink from '$components/IconLink/IconLink.svelte'
  import DeleteModal from './DeleteModal.svelte'
  import Form from '$components/Form/Form.svelte'
  import FormControl from '$components/FormControls/FormControl.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'
  import Textarea from '$components/FormControls/Textarea.svelte'

  export let data

  const sForm = superForm(data.updateForm, {
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toastStore.trigger({
          message: 'Promotion has been updated.',
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
  <title>Edit Promotion | VF Columbus</title>
</svelte:head>

<PageLayout
  contentWrapperStyles="max-w-4xl space-y-8"
  headerWrapperStyles="space-y-2"
>
  <svelte:fragment slot="header">
    <h1>Edit Promotion</h1>
    <IconLink
      href="/promotions"
      label="All Promotions"
      iconSource={ArrowUturnLeft}
    />
  </svelte:fragment>

  <h2>Promotion: {data.promo.title}</h2>

  <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
    <button
      type="button"
      class="btn variant-soft-error hover:variant-filled-error"
      on:click={() => {
        modalStore.trigger({
          type: 'component',
          component: {
            ref: DeleteModal,
            props: { promo: data.promo, form: data.deleteForm }
          }
        })
      }}>Delete Promotion</button
    >
    <span class="flex items-center gap-2 text-warning-600 dark:text-warning-500">
      <Icon
        src={ExclamationTriangle}
        size="1.5em"
      />Warning: this cannot be undone
    </span>
  </div>

  <Form
    action="?/update&promo_id={data.promo.id}"
    superForm={sForm}
  >
    <!-- Promo Id -->
    <input
      hidden
      type="hidden"
      id="id"
      name="id"
      class="absolute -left-[9999px] hidden h-0 w-0"
      bind:value={$formStore.id}
    />

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
      rows={getInitialRows($formStore.sale)}
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
      rows={getInitialRows($formStore.details)}
    />

    <!-- Notes -->
    <Textarea
      form={sForm}
      field="notes"
      rows={getInitialRows($formStore.notes)}
    />

    <svelte:fragment slot="actions">
      <button
        type="submit"
        class="btn variant-filled-primary">Update Promotion</button
      >
    </svelte:fragment>
  </Form>
</PageLayout>
