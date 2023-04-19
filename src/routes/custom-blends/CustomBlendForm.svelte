<script lang="ts">
  import type { superForm as superFormType } from 'sveltekit-superforms/client'

  import type {
    insertCustomBlendSchema,
    updateCustomBlendSchema
  } from '$lib/schemas/customBlends'
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
  import { categoriesFromFlavors } from '$lib/utils/flavors'

  import { FormControl, FormMessage } from '$components'

  type Schema = $$Generic<
    typeof insertCustomBlendSchema | typeof updateCustomBlendSchema
  >

  export let superform: ReturnType<typeof superFormType<Schema>>
  export let flavors: DatabaseRow<'flavors'>[]
  const categories = categoriesFromFlavors(flavors)
  export let isAdmin = false
  export let action: string | null = null

  const { form, enhance, message, constraints, errors } = superform
  // Prevent already chosen flavors from showing as options for other inputs
  $: flavor1Options = flavors
    .filter(({ id }) => id !== $form.flavor2_id && id !== $form.flavor3_id)
    .map((f) => ({ value: f.id, label: f.flavor, group: f.category }))
  $: flavor2Options = flavors
    .filter(({ id }) => id !== $form.flavor1_id && id !== $form.flavor3_id)
    .map((f) => ({ value: f.id, label: f.flavor, group: f.category }))
  $: flavor3Options = flavors
    .filter(({ id }) => id !== $form.flavor1_id && id !== $form.flavor2_id)
    .map((f) => ({ value: f.id, label: f.flavor, group: f.category }))

  // Flavor values and shot values depend on the number of flavors
  $: switch ($form.flavorCount) {
    case 1:
      $form.flavor2_id = $form.flavor3_id = $form.shots2 = $form.shots3 = null
      break
    case 2:
      if ($form.shots2 === 2) {
        $form.shots1 = 1
      } else if ($form.shots1 >= 2) {
        $form.shots1 = 2
        $form.shots2 = 1
      } else {
        $form.shots2 = 1
      }
      $form.flavor3_id = $form.shots3 = null
      break
    case 3:
      $form.shots1 = $form.shots2 = $form.shots3 = 1
      break
  }
</script>

<form
  method="post"
  {action}
  use:enhance
  class="form"
>
  <FormControl
    label="Blend Name"
    errors={$errors.name}
  >
    <input
      type="text"
      name="name"
      bind:value={$form.name}
      {...$constraints.name}
    />
  </FormControl>

  <FormControl
    label="Flavor Count"
    errors={$errors.flavorCount}
  >
    <div class="radio-group">
      <label>
        <input
          type="radio"
          name="flavorCount"
          value={1}
          bind:group={$form.flavorCount}
          {...$constraints.flavorCount}
        />
        <span>1 Flavor</span>
      </label>
      <label>
        <input
          type="radio"
          name="flavorCount"
          value={2}
          bind:group={$form.flavorCount}
          {...$constraints.flavorCount}
        />
        <span>2 Flavors</span>
      </label>
      <label>
        <input
          type="radio"
          name="flavorCount"
          value={3}
          bind:group={$form.flavorCount}
          {...$constraints.flavorCount}
        />
        <span>3 Flavors</span>
      </label>
    </div>
  </FormControl>

  <!-- Flavor 1 and shots 1 -->
  <div class="flex flex-col gap-1">
    <FormControl
      label="Flavor 1"
      errors={$errors.flavor1_id}
    >
      <select
        class:placeholder={$form.flavor1_id === 0}
        name="flavor1_id"
        bind:value={$form.flavor1_id}
        {...$constraints.flavor1_id}
      >
        <option value={0}>Select a flavor</option>
        {#each categories as group}
          <optgroup label={group}>
            {#each flavor1Options.filter((option) => option.group === group) as { value, label }}
              <option {value}>{label}</option>
            {/each}
          </optgroup>
        {/each}</select
      >
    </FormControl>

    <FormControl
      label="Shots"
      errors={$errors.shots1}
    >
      <div class="radio-group">
        <label>
          <input
            type="radio"
            name="shots1"
            value={1}
            bind:group={$form.shots1}
          />
          <span>Single</span>
        </label>
        {#if $form.flavorCount < 3 && $form.shots2 !== 2}
          <label>
            <input
              type="radio"
              name="shots1"
              value={2}
              bind:group={$form.shots1}
            />
            <span>Double</span>
          </label>
        {/if}
        {#if $form.flavorCount === 1}
          <label>
            <input
              type="radio"
              name="shots1"
              value={3}
              bind:group={$form.shots1}
            />
            <span>Triple</span>
          </label>
        {/if}
      </div>
    </FormControl>
  </div>

  <!-- Flavor 2 and shots 2 -->
  {#if $form.flavorCount > 1}
    <div class="flex flex-col gap-1">
      <FormControl
        label="Flavor 2"
        errors={$errors.flavor2_id}
      >
        <select
          class:placeholder={$form.flavor2_id === null}
          name="flavor2_id"
          bind:value={$form.flavor2_id}
          {...$constraints.flavor2_id}
        >
          <option value={null}>Select a flavor</option>
          {#each categories as group}
            <optgroup label={group}>
              {#each flavor2Options.filter((option) => option.group === group) as { value, label }}
                <option {value}>{label}</option>
              {/each}
            </optgroup>
          {/each}</select
        >
      </FormControl>

      <FormControl
        label="Shots"
        errors={$errors.shots2}
      >
        <div class="radio-group">
          <label>
            <input
              type="radio"
              name="shots2"
              value={1}
              bind:group={$form.shots2}
            />
            <span>Single</span>
          </label>
          {#if $form.flavorCount === 2 && $form.shots1 !== 2}
            <label>
              <input
                type="radio"
                name="shots2"
                value={2}
                bind:group={$form.shots2}
              />
              <span>Double</span>
            </label>
          {/if}
        </div>
      </FormControl>
    </div>
  {/if}

  <!-- Flavor 3 and shots 3 -->
  {#if $form.flavorCount > 2}
    <div class="flex flex-col gap-1">
      <FormControl
        label="Flavor 3"
        errors={$errors.flavor3_id}
      >
        <select
          class:placeholder={$form.flavor3_id === null}
          name="flavor3_id"
          bind:value={$form.flavor3_id}
          {...$constraints.flavor3_id}
        >
          <option value={null}>Select a flavor</option>
          {#each categories as group}
            <optgroup label={group}>
              {#each flavor3Options.filter((option) => option.group === group) as { value, label }}
                <option {value}>{label}</option>
              {/each}
            </optgroup>
          {/each}</select
        >
      </FormControl>

      <FormControl
        label="Shots"
        errors={$errors.shots3}
      >
        <div class="radio-group">
          <label>
            <input
              type="radio"
              name="shots3"
              value={1}
              bind:group={$form.shots3}
            />
            <span>Single</span>
          </label>
        </div>
      </FormControl>
    </div>
  {/if}

  {#if isAdmin}
    <label class="checkbox">
      <input
        type="checkbox"
        name="approved"
        bind:checked={$form.approved}
      />
      <span>Approved</span>
    </label>
  {/if}

  <FormMessage message={$message} />

  <button
    type="submit"
    class="btn btn-primary"
    >{'id' in $form ? 'Update' : 'Create'} Custom Blend</button
  >
</form>
