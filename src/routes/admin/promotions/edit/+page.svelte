<script lang="ts">
  import toast from 'svelte-french-toast'
  import { ArrowUturnLeft, Icon } from 'svelte-hero-icons'
  import { dateProxy, superForm } from 'sveltekit-superforms/client'

  import FormControl from '$components/FormControl.svelte'
  import PageLayout from '$components/PageLayout.svelte'

  export let data

  const { form, enhance, message, errors, constraints } = superForm(data.form, {
    resetForm: false,
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      if (type === 'success') {
        toast.success('Promotion updated successfully.')
      }
    }
  })

  const getInitialRows = (str: string) => (str.match(/\n/g) || '').length + 1

  const validFromProxy = dateProxy(form, 'valid_from', {
    format: 'datetime-local'
  })
  const validUntilProxy = dateProxy(form, 'valid_until', {
    format: 'datetime-local'
  })
</script>

<svelte:head>
  <title>Edit Promotion | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="max-w-2xl">
  <svelte:fragment slot="header">
    <h1>Edit Promotion | {data.promo.title}</h1>
    <a
      href="/admin/promotions"
      class="link link-primary"
    >
      <Icon
        src={ArrowUturnLeft}
        size="1em"
      />
      All Promotions
    </a>
  </svelte:fragment>

  <form
    method="post"
    use:enhance
    class="form"
  >
    <FormControl
      label="Title"
      errors={$errors.title}
    >
      <input
        type="text"
        name="title"
        bind:value={$form.title}
        data-invalid={$errors.title}
        {...$constraints.title}
      />
    </FormControl>

    <FormControl
      label="Subtitle"
      errors={$errors.subtitle}
    >
      <input
        type="text"
        name="subtitle"
        bind:value={$form.subtitle}
        data-invalid={$errors.subtitle}
        {...$constraints.subtitle}
      />
    </FormControl>

    <FormControl
      label="Custom blend"
      errors={$errors.custom_blend_id}
    >
      <select
        name="custom_blend_id"
        bind:value={$form.custom_blend_id}
        data-invalid={$errors.custom_blend_id}
        {...$constraints.custom_blend_id}
      >
        <option value={null}>None</option>
        {#each data.customBlends as blend (blend.id)}
          <option value={blend.id}>{blend.name}</option>
        {/each}
      </select>
    </FormControl>

    <FormControl
      label="Sale"
      errors={$errors.sale}
    >
      <textarea
        rows={getInitialRows($form.sale) || 3}
        bind:value={$form.sale}
        data-invalid={$errors.sale}
        {...$constraints.sale}
      />
    </FormControl>

    <div class="flex flex-wrap gap-4 [&>*]:flex-1">
      <FormControl
        label="Valid from"
        errors={$errors.valid_from}
      >
        <input
          type="datetime-local"
          bind:value={$validFromProxy}
          data-invalid={$errors.valid_from}
          {...$constraints.valid_from}
          class="cursor-pointer before:cursor-pointer"
        />
      </FormControl>
      <FormControl
        label="Valid until"
        errors={$errors.valid_until}
      >
        <input
          type="datetime-local"
          bind:value={$validUntilProxy}
          data-invalid={$errors.valid_until}
          {...$constraints.valid_until}
          class="cursor-pointer before:cursor-pointer"
        />
      </FormControl>
    </div>

    <FormControl
      label="Details"
      errors={$errors.details}
    >
      <textarea
        rows={$form.details ? getInitialRows($form.details) : 3}
        bind:value={$form.details}
        data-invalid={$errors.details}
        {...$constraints.details}
      />
    </FormControl>

    <FormControl
      label="Notes"
      errors={$errors.notes}
    >
      <textarea
        rows={$form.notes ? getInitialRows($form.notes) : 3}
        bind:value={$form.notes}
        data-invalid={$errors.notes}
        {...$constraints.notes}
      />
    </FormControl>

    {#if $message}
      <span class="form-error">{$message}</span>
    {/if}

    <button
      type="submit"
      class="btn btn-primary">Update Promotion</button
    >
  </form>
</PageLayout>
