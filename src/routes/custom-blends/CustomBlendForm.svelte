<script lang="ts">
  import type { UnwrapEffects } from 'sveltekit-superforms/index'
  import type { SuperForm } from 'sveltekit-superforms/client'
  import type { insertCustomBlendSchema, updateCustomBlendSchema } from '$lib/schemas/customBlends'
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
  import {
    categoriesFromFlavors,
    setBlendFormValues,
    setCustomBlendFlavorOptions
  } from '$lib/utils/flavors'

  // Components
  import Form from '$components/Form/Form.svelte'
  import FormControl from '$components/FormControls/FormControl.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import RadioButton from '$components/FormControls/RadioButton.svelte'
  import Checkbox from '$components/FormControls/Checkbox.svelte'

  type Schema = $$Generic<typeof insertCustomBlendSchema | typeof updateCustomBlendSchema>

  export let superForm: SuperForm<UnwrapEffects<Schema>>
  export let flavors: DatabaseRow<'flavors'>[]
  export let isAdmin = false
  export let action: string | undefined = undefined
  export let disabled = false

  const categories = categoriesFromFlavors(flavors)
  const { form, errors, reset } = superForm

  $: ({ flavor1Options, flavor2Options, flavor3Options } = setCustomBlendFlavorOptions(
    $form,
    flavors
  ))

  $: $form = setBlendFormValues($form)
</script>

<Form
  {superForm}
  {action}
>
  <!-- Update blend id -->
  {#if 'id' in $form}
    <input
      hidden
      type="hidden"
      id="id"
      name="id"
      bind:value={$form.id}
    />
  {/if}

  <!-- Blend name -->
  <TextInput
    form={superForm}
    field="name"
    {disabled}
  />

  <!-- Flavor count -->
  <FormControl
    label="Flavor Count"
    errors={$errors.flavorCount}
  >
    <div class="flex flex-wrap items-center gap-4">
      <RadioButton
        form={superForm}
        field="flavorCount"
        label="1 Flavor"
        value={1}
        {disabled}
      />
      <RadioButton
        form={superForm}
        field="flavorCount"
        label="2 Flavors"
        value={2}
        {disabled}
      />
      <RadioButton
        form={superForm}
        field="flavorCount"
        label="3 Flavors"
        value={3}
        {disabled}
      />
    </div>
  </FormControl>

  <!-- Flavor 1 and shots 1 -->
  <div class="flex flex-col gap-1">
    <!-- Flavor 1 -->
    <Select
      form={superForm}
      field="flavor1_id"
      label="Flavor 1"
      {disabled}
    >
      {#each categories as category}
        <optgroup label={category}>
          {#each flavor1Options.filter((option) => option.group === category) as { value, label } (value)}
            <option {value}>{label}</option>
          {/each}
        </optgroup>
      {/each}
    </Select>

    <!-- Shots 1 -->
    <FormControl
      label="Shots"
      errors={$errors.shots1}
    >
      <div class="flex flex-wrap items-center gap-4">
        <RadioButton
          form={superForm}
          field="shots1"
          label="Single"
          value={1}
          {disabled}
        />
        {#if $form.flavorCount < 3 && $form.shots2 !== 2}
          <RadioButton
            form={superForm}
            field="shots1"
            label="Double"
            value={2}
            {disabled}
          />
        {/if}
        {#if $form.flavorCount === 1}
          <RadioButton
            form={superForm}
            field="shots1"
            label="Triple"
            value={3}
            {disabled}
          />
        {/if}
      </div>
    </FormControl>
  </div>

  <!-- Flavor 2 and shots 2 -->
  {#if $form.flavorCount > 1}
    <div class="flex flex-col gap-1">
      <!-- Flavor 2 -->
      <Select
        form={superForm}
        field="flavor2_id"
        label="Flavor 2"
        {disabled}
      >
        {#each categories as category}
          <optgroup label={category}>
            {#each flavor2Options.filter((option) => option.group === category) as { value, label } (value)}
              <option {value}>{label}</option>
            {/each}
          </optgroup>
        {/each}
      </Select>

      <!-- Shots 2 -->
      <FormControl
        label="Shots"
        errors={$errors.shots1}
      >
        <div class="flex flex-wrap items-center gap-4">
          <RadioButton
            form={superForm}
            field="shots2"
            label="Single"
            value={1}
            {disabled}
          />
          {#if $form.flavorCount === 2 && $form.shots1 !== 2}
            <RadioButton
              form={superForm}
              field="shots2"
              label="Double"
              value={2}
              {disabled}
            />
          {/if}
        </div>
      </FormControl>
    </div>
  {/if}

  <!-- Flavor 3 and shots 3 -->
  {#if $form.flavorCount > 2}
    <div class="flex flex-col gap-1">
      <!-- Flavor 3 -->
      <Select
        form={superForm}
        field="flavor3_id"
        label="Flavor 3"
        {disabled}
      >
        {#each categories as category}
          <optgroup label={category}>
            {#each flavor3Options.filter((option) => option.group === category) as { value, label } (value)}
              <option {value}>{label}</option>
            {/each}
          </optgroup>
        {/each}
      </Select>

      <!-- Shots 3 -->
      <FormControl
        label="Shots"
        errors={$errors.shots1}
      >
        <div class="flex flex-wrap items-center gap-4">
          <RadioButton
            form={superForm}
            field="shots3"
            label="Single"
            value={1}
            {disabled}
          />
        </div>
      </FormControl>
    </div>
  {/if}

  {#if isAdmin}
    <Checkbox
      form={superForm}
      field="approved"
      label="Approved"
      {disabled}
    />
  {/if}

  <svelte:fragment slot="actions">
    <button
      type="button"
      class="btn variant-filled-surface hover:variant-filled"
      on:click={() => reset({ keepMessage: false })}
      {disabled}>Reset</button
    >
    <button
      type="submit"
      class="btn variant-filled-primary"
      {disabled}>{'id' in $form ? 'Update' : 'Create'} Blend</button
    >
  </svelte:fragment>
</Form>
