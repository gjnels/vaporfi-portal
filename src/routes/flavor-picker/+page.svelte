<script lang="ts">
  import cuid2 from '@paralleldrive/cuid2'
  import { superForm } from 'sveltekit-superforms/client'

  import type { PageData } from './$types'

  import { savedBlends, storeSavedBlends } from '$lib/stores/savedBlends'
  import type { SavedFlavorPickerBlend } from '$lib/types/flavors.types'
  import { copyBlendToClipboard } from '$lib/utils/clipboard'
  import { categoriesFromFlavors } from '$lib/utils/flavors'

  import { FormControl, PageLayout } from '$components'

  import BlendList from './BlendList.svelte'

  export let data: PageData

  $: flavors = data.flavors
  $: categories = categoriesFromFlavors(flavors)

  // Maximum number of blends to save in local storage
  const MAX_SAVED_BLENDS = 10

  const { form, enhance, errors, constraints, reset } = superForm(data.form, {
    clearOnSubmit: 'none',
    invalidateAll: false,
    dataType: 'json',
    onUpdated: ({ form }) => {
      console.log(form)
      if (form.valid) {
        // Get blend data from form
        // If it does not have an id, create a new one
        const blend: SavedFlavorPickerBlend = form.data.id
          ? { ...form.data, id: form.data.id }
          : { ...form.data, id: cuid2.createId() }

        // Store the blend in savedBlends with a limit on the number of saved blends
        $savedBlends = [
          blend,
          ...$savedBlends.filter((savedBlend) => savedBlend.id !== blend.id)
        ].slice(0, MAX_SAVED_BLENDS)

        if (form.data.id) {
          // This is an already existing saved blend
          // Reset form to prevent unwanted update of a saved blend
          reset({ keepMessage: false })
        }

        // Save blends to storage
        storeSavedBlends()

        // Copy blend string to clipboard
        copyBlendToClipboard(blend)
      }
    }
  })

  // Set form values to the selected blend to edit
  const editBlend = (blend: SavedFlavorPickerBlend) => {
    $form = { ...$form, ...blend }
  }

  // Delete a saved blend from savedBlends and store the new savedBlends to localStorage
  const deleteBlend = (blend: SavedFlavorPickerBlend) => {
    $savedBlends = $savedBlends.filter(
      (savedBlend) => savedBlend.id !== blend.id
    )
    storeSavedBlends()

    // If the form is currently editing this deleted blend, reset the entire form
    if ($form.id === blend.id) reset({ keepMessage: false })
  }

  const shotOptions = [
    { value: 1, label: 'Single Shot' },
    { value: 2, label: 'Double Shot' },
    { value: 3, label: 'Triple Shot' }
  ]

  // Prevent already chosen flavors from showing as options for other inputs
  $: flavor1Options = flavors
    .filter(
      ({ flavor }) => flavor !== $form.flavor2 && flavor !== $form.flavor3
    )
    .map((f) => ({ value: f.flavor, label: f.flavor, group: f.category }))
  $: flavor2Options = flavors
    .filter(
      ({ flavor }) => flavor !== $form.flavor1 && flavor !== $form.flavor3
    )
    .map((f) => ({ value: f.flavor, label: f.flavor, group: f.category }))
  $: flavor3Options = flavors
    .filter(
      ({ flavor }) => flavor !== $form.flavor1 && flavor !== $form.flavor2
    )
    .map((f) => ({ value: f.flavor, label: f.flavor, group: f.category }))

  // Flavor values and shot values depend on the number of flavors
  $: switch ($form.flavorCount) {
    case 1:
      $form.flavor2 = $form.flavor3 = ''
      $form.shots2 = $form.shots3 = null
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
      $form.flavor3 = ''
      $form.shots3 = null
      break
    case 3:
      $form.shots1 = $form.shots2 = $form.shots3 = 1
      break
  }
</script>

<svelte:head>
  <title>Flavor Picker | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="grid lg:grid-cols-2 gap-10">
  <h1 slot="header">Flavor Picker</h1>

  <form
    method="post"
    use:enhance
    class="form"
  >
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
          />
          <span>1 Flavor</span>
        </label>
        <label>
          <input
            type="radio"
            name="flavorCount"
            value={2}
            bind:group={$form.flavorCount}
          />
          <span>2 Flavors</span>
        </label>
        <label>
          <input
            type="radio"
            name="flavorCount"
            value={3}
            bind:group={$form.flavorCount}
          />
          <span>3 Flavors</span>
        </label>
      </div>
    </FormControl>

    <!-- Flavor 1 and shots 1 -->
    <div class="flex flex-col gap-1">
      <FormControl
        label="Flavor 1"
        errors={$errors.flavor1}
      >
        <select
          class:placeholder={$form.flavor1 === ''}
          name="flavor1"
          bind:value={$form.flavor1}
          {...$constraints.flavor1}
        >
          <option value="">Select a flavor</option>
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
        label=""
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
            <span>Single Shot</span>
          </label>
          {#if $form.flavorCount < 3 && $form.shots2 !== 2}
            <label>
              <input
                type="radio"
                name="shots1"
                value={2}
                bind:group={$form.shots1}
              />
              <span>Double Shot</span>
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
              <span>Triple Shot</span>
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
          errors={$errors.flavor2}
        >
          <select
            class:placeholder={$form.flavor2 === ''}
            name="flavor2"
            bind:value={$form.flavor2}
            {...$constraints.flavor2}
          >
            <option value="">Select a flavor</option>
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
          label=""
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
              <span>Single Shot</span>
            </label>
            {#if $form.flavorCount === 2 && $form.shots1 !== 2}
              <label>
                <input
                  type="radio"
                  name="shots2"
                  value={2}
                  bind:group={$form.shots2}
                />
                <span>Double Shot</span>
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
          errors={$errors.flavor3}
        >
          <select
            class:placeholder={$form.flavor3 === ''}
            name="flavor3"
            bind:value={$form.flavor3}
            {...$constraints.flavor3}
          >
            <option value="">Select a flavor</option>
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
          label=""
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
              <span>Single Shot</span>
            </label>
          </div>
        </FormControl>
      </div>
    {/if}

    <div class="flex flex-wrap gap-3 [&>*]:flex-1">
      <FormControl
        label="Nicotine level"
        errors={$errors.nicotine}
      >
        <input
          type="number"
          name="nicotine"
          bind:value={$form.nicotine}
          {...$constraints.nicotine}
        />
      </FormControl>

      <FormControl
        label="Number of bottles"
        errors={$errors.bottleCount}
      >
        <input
          type="number"
          name="bottleCount"
          bind:value={$form.bottleCount}
          {...$constraints.bottleCount}
        />
      </FormControl>
    </div>

    <div class="btn-group">
      {#if $form.id}
        <!-- Editing a blend -->
        <button
          type="submit"
          class="btn btn-primary">Update Blend</button
        >
        <button
          type="button"
          class="btn btn-secondary"
          on:click={() => reset({ keepMessage: false })}>Cancel</button
        >
      {:else}
        <!-- Creating a new blend -->
        <button
          type="submit"
          class="btn btn-primary">Create Blend</button
        >
        <button
          type="button"
          class="btn"
          on:click={() => reset({ keepMessage: false })}>Reset Form</button
        >
      {/if}
    </div>
  </form>

  <BlendList
    onEdit={editBlend}
    onDelete={deleteBlend}
  />
</PageLayout>
