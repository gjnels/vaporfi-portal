<script lang="ts">
  import {
    dateProxy,
    type superForm as superFormType
  } from 'sveltekit-superforms/client'

  import type { promoInsertSchema, promoSchema } from '$lib/schemas/promos'
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'

  import { FormControl, FormMessage } from '$components'

  type Schema = $$Generic<typeof promoInsertSchema | typeof promoSchema>

  export let customBlends: Pick<DatabaseRow<'custom_blends'>, 'id' | 'name'>[]
  export let superform: ReturnType<typeof superFormType<Schema, Message>>
  export let action: string | null = null

  const { form, enhance, message, errors, constraints } = superform

  const validFromProxy = dateProxy(form, 'valid_from', {
    format: 'datetime-local'
  })
  const validUntilProxy = dateProxy(form, 'valid_until', {
    format: 'datetime-local'
  })

  const getInitialRows = (str: string) => (str.match(/\n/g) || '').length + 1
</script>

<form
  method="post"
  {action}
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
      {#each customBlends as blend (blend.id)}
        <option value={blend.id}>{blend.name}</option>
      {/each}
    </select>
  </FormControl>

  <FormControl
    label="Sale"
    errors={$errors.sale}
  >
    <textarea
      name="sale"
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
        name="valid_from"
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
        name="valid_until"
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
      name="details"
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
      name="notes"
      rows={$form.notes ? getInitialRows($form.notes) : 3}
      bind:value={$form.notes}
      data-invalid={$errors.notes}
      {...$constraints.notes}
    />
  </FormControl>

  <div class="form-actions flex flex-wrap items-center gap-4">
    <FormMessage message={$message} />
    <button
      type="submit"
      class="btn btn-primary ml-auto"
      >{'id' in $form ? 'Update' : 'Create'} Promotion</button
    >
  </div>
</form>
