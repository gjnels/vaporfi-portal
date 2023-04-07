<script lang="ts">
  import cuid2 from '@paralleldrive/cuid2'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import type { PageData } from './$types'

  import { savedBlends, storeSavedBlends } from '$lib/stores/savedBlends'
  import type { SavedFlavorPickerBlend } from '$lib/types/flavors.types'
  import { copyBlendToClipboard } from '$lib/utils/clipboard'
  import { categoriesFromFlavors } from '$lib/utils/flavors'

  import { Button, PageLayout, PageTitle } from '$components'
  import { Form, Input, RadioGroup, Select } from '$components/forms'

  import BlendList from './BlendList.svelte'

  export let data: PageData

  $: flavors = data.flavors
  $: categories = categoriesFromFlavors(flavors)

  // Maximum number of blends to save in local storage
  const MAX_SAVED_BLENDS = 10

  const { form, enhance, errors, constraints, reset } = superForm(data.form, {
    clearOnSubmit: 'none',
    invalidateAll: false,
    onUpdated: ({ form }) => {
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
          resetForm()
        }

        // Save blends to storage
        storeSavedBlends()

        // Copy blend string to clipboard
        copyBlendToClipboard(blend)
      }
    }
  })

  const flavorCount = writable<1 | 2 | 3>(1)

  // Set form values to the selected blend to edit
  const editBlend = (blend: SavedFlavorPickerBlend) => {
    $flavorCount = blend.flavor3 ? 3 : blend.flavor2 ? 2 : 1
    $form = { ...$form, ...blend }
  }

  // Delete a saved blend from savedBlends and store the new savedBlends to localStorage
  const deleteBlend = (blend: SavedFlavorPickerBlend) => {
    $savedBlends = $savedBlends.filter(
      (savedBlend) => savedBlend.id !== blend.id
    )
    storeSavedBlends()

    // If the form is currently editing this deleted blend, reset the entire form
    if ($form.id === blend.id) resetForm()
  }

  const resetForm = () => {
    $flavorCount = 1 // Reset flavor count
    reset({ keepMessage: false })
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
  $: switch ($flavorCount) {
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
  <PageTitle
    title="Flavor Picker"
    slot="header"
  />

  <Form {enhance}>
    <RadioGroup
      label="Flavor Count"
      name="flavor-count"
      bind:group={$flavorCount}
      options={[
        { value: 1, label: '1 Flavor' },
        { value: 2, label: '2 Flavors' },
        { value: 3, label: '3 Flavors' }
      ]}
      constraints={{ min: 1, max: 3, required: true }}
      horizontal
      color="purple"
    />

    <!-- Flavor 1 and shots 1 -->
    <div class="flex flex-col gap-1">
      <Select
        name="flavor1"
        label="Flavor 1"
        bind:value={$form.flavor1}
        options={flavor1Options}
        defaultOption={{ value: '', label: 'Select a flavor' }}
        groups={categories}
        constraints={$constraints.flavor1}
        errors={$errors.flavor1}
      />

      <RadioGroup
        name="shots1"
        bind:group={$form.shots1}
        options={$flavorCount === 3 || $form.shots2 == 2
          ? shotOptions.slice(0, 1)
          : $flavorCount === 2
          ? shotOptions.slice(0, 2)
          : shotOptions}
        constraints={$constraints.shots1}
        errors={$errors.shots1}
        horizontal
        color="purple"
        containerStyles="ml-1"
      />
    </div>

    <!-- Flavor 2 and shots 2 -->
    {#if $flavorCount > 1}
      <div class="flex flex-col gap-1">
        <Select
          name="flavor2"
          label="Flavor 2"
          bind:value={$form.flavor2}
          options={flavor2Options}
          defaultOption={{ value: '', label: 'Select a flavor' }}
          groups={categories}
          constraints={$constraints.flavor2}
          errors={$errors.flavor2}
        />

        <RadioGroup
          name="shots2"
          bind:group={$form.shots2}
          options={$flavorCount === 3 || $form.shots1 > 1
            ? shotOptions.slice(0, 1)
            : shotOptions.slice(0, 2)}
          constraints={$constraints.shots2}
          errors={$errors.shots2}
          horizontal
          color="purple"
          containerStyles="ml-1"
        />
      </div>
    {/if}

    <!-- Flavor 3 and shots 3 -->
    {#if $flavorCount > 2}
      <div class="flex flex-col gap-1">
        <Select
          name="flavor3"
          label="Flavor 3"
          bind:value={$form.flavor3}
          options={flavor3Options}
          defaultOption={{ value: '', label: 'Select a flavor' }}
          groups={categories}
          constraints={$constraints.flavor3}
          errors={$errors.flavor3}
        />

        <RadioGroup
          name="shots3"
          bind:group={$form.shots3}
          options={shotOptions.slice(0, 1)}
          constraints={$constraints.shots3}
          errors={$errors.shots3}
          horizontal
          color="purple"
          containerStyles="ml-1"
        />
      </div>
    {/if}

    <div class="flex flex-wrap gap-3">
      <Input
        type="number"
        name="nicotine"
        label="Nicotine level"
        bind:value={$form.nicotine}
        errors={$errors.nicotine}
        constraints={$constraints.nicotine}
        containerStyles="grow"
      />

      <Input
        type="number"
        name="bottleCount"
        label="Number of bottles"
        bind:value={$form.bottleCount}
        errors={$errors.bottleCount}
        constraints={$constraints.bottleCount}
        containerStyles="grow"
      />
    </div>

    <svelte:fragment slot="actions">
      {#if $form.id}
        <!-- Editing a blend -->
        <Button
          type="submit"
          color="green">Update Blend</Button
        >
        <Button
          color="purple"
          onclick={resetForm}>Cancel</Button
        >
      {:else}
        <!-- Creating a new blend -->
        <Button
          type="submit"
          color="green">Create Blend</Button
        >
        <Button
          color="gray"
          onclick={resetForm}>Reset Form</Button
        >
      {/if}
    </svelte:fragment>
  </Form>

  <BlendList
    onEdit={editBlend}
    onDelete={deleteBlend}
  />
</PageLayout>
