<script lang="ts">
  import type { SuperForm } from 'sveltekit-superforms/client'
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
  import type { flavorPickerSchema } from '$lib/schemas/customBlends'
  import {
    categoriesFromFlavors,
    setBlendFormValues,
    setFlavorPickerFlavorOptions
  } from '$lib/utils/flavors'

  // Components
  import Form from '$lib/components/Form/Form.svelte'
  import FormControl from '$components/FormControls/FormControl.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import NumberInput from '$components/FormControls/NumberInput.svelte'
  import RadioButton from '$components/FormControls/RadioButton.svelte'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  let ban = false

  export let sForm: SuperForm<typeof flavorPickerSchema>
  export let flavors: DatabaseRow<'flavors'>[]
  $: categories = categoriesFromFlavors(flavors)

  $: ({ form, errors, reset } = sForm)

  $: ({ flavor1Options, flavor2Options, flavor3Options } = setFlavorPickerFlavorOptions(
    $form,
    flavors
  ))

  // Flavor values and shot values depend on the number of flavors
  $: $form = setBlendFormValues($form)

  const saveBanSetting = () => {
    if (!browser) return
    localStorage.setItem('ban', JSON.stringify(ban))
  }

  onMount(() => {
    const storedBan = localStorage.getItem('ban')
    if (storedBan === null) {
      saveBanSetting()
    } else {
      ban = JSON.parse(storedBan)
    }
  })
</script>

<Form
  superForm={sForm}
  baseClass="max-w-2xl mx-auto"
>
  <label class="flex w-fit items-center gap-2">
    <input
      type="checkbox"
      class="checkbox"
      bind:checked={ban}
      on:change={saveBanSetting}
    />
    <span class="text-xl font-semibold tracking-wide">Affected by Flavor Ban?</span>
  </label>
  <!-- Flavor count -->
  <FormControl
    label="Flavor Count"
    errors={$errors.flavorCount}
  >
    <div class="flex flex-wrap items-center gap-4">
      <RadioButton
        form={sForm}
        field="flavorCount"
        label="1 Flavor"
        value={1}
      />
      <RadioButton
        form={sForm}
        field="flavorCount"
        label="2 Flavors"
        value={2}
      />
      <RadioButton
        form={sForm}
        field="flavorCount"
        label="3 Flavors"
        value={3}
      />
    </div>
  </FormControl>

  <!-- Flavor 1 and shots 1 -->
  <div class="flex flex-col gap-1">
    <!-- Flavor 1 -->
    <Select
      form={sForm}
      field="flavor1"
      label="Flavor 1"
    >
      <option value="">Select a flavor</option>
      {#each categories as category}
        <optgroup label={category}>
          {#each flavor1Options.filter((option) => option.category === category && (!ban || option.flavor_ban_name !== null)) as flavor (flavor.id)}
            <option value={ban ? flavor.flavor_ban_name : flavor.flavor}
              >{ban ? `${flavor.flavor_ban_name} (${flavor.flavor})` : flavor.flavor}</option
            >
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
          form={sForm}
          field="shots1"
          label="Single"
          value={1}
        />
        {#if $form.flavorCount < 3 && $form.shots2 !== 2}
          <RadioButton
            form={sForm}
            field="shots1"
            label="Double"
            value={2}
          />
        {/if}
        {#if $form.flavorCount === 1}
          <RadioButton
            form={sForm}
            field="shots1"
            label="Triple"
            value={3}
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
        form={sForm}
        field="flavor2"
        label="Flavor 2"
      >
        <option value="">Select a flavor</option>
        {#each categories as category}
          <optgroup label={category}>
            {#each flavor2Options.filter((option) => option.category === category && (!ban || option.flavor_ban_name !== null)) as flavor (flavor.id)}
              <option value={ban ? flavor.flavor_ban_name : flavor.flavor}
                >{ban ? `${flavor.flavor_ban_name} (${flavor.flavor})` : flavor.flavor}</option
              >
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
            form={sForm}
            field="shots2"
            label="Single"
            value={1}
          />
          {#if $form.flavorCount === 2 && $form.shots1 !== 2}
            <RadioButton
              form={sForm}
              field="shots2"
              label="Double"
              value={2}
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
        form={sForm}
        field="flavor3"
        label="Flavor 3"
      >
        <option value="">Select a flavor</option>
        {#each categories as category}
          <optgroup label={category}>
            {#each flavor3Options.filter((option) => option.category === category && (!ban || option.flavor_ban_name !== null)) as flavor (flavor.id)}
              <option value={ban ? flavor.flavor_ban_name : flavor.flavor}
                >{ban ? `${flavor.flavor_ban_name} (${flavor.flavor})` : flavor.flavor}</option
              >
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
            form={sForm}
            field="shots3"
            label="Single"
            value={1}
          />
        </div>
      </FormControl>
    </div>
  {/if}

  <div class="flex flex-wrap gap-4 [&>*]:flex-1">
    <!-- Nicotine level -->
    <NumberInput
      form={sForm}
      field="nicotine"
      step="any"
      label="Nicotine Level"
    />

    <!-- Bottle count -->
    <NumberInput
      form={sForm}
      field="bottleCount"
      label="Bottle Count"
    />
  </div>

  <svelte:fragment slot="actions">
    {#if $form.id}
      <!-- Editing a blend -->
      <button
        type="button"
        class="btn variant-soft-secondary hover:variant-filled-secondary"
        on:click={() => reset({ keepMessage: false })}>Cancel</button
      >
      <button
        type="submit"
        class="btn variant-filled-tertiary">Update Blend</button
      >
    {:else}
      <!-- Creating a new blend -->
      <button
        type="button"
        class="btn variant-filled-surface hover:variant-filled"
        on:click={() => reset({ keepMessage: false })}>Reset</button
      >
      <button
        type="submit"
        class="btn variant-filled-primary">Create Blend</button
      >
    {/if}
  </svelte:fragment>
</Form>
