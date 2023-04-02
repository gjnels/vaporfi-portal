<script lang="ts">
  import type { PageData } from './$types'
  import { Button, PageLayout, PageTitle } from '$components'
  import { Form, Input, RadioGroup, Select } from '$components/forms'
  import { numberProxy, superForm } from 'sveltekit-superforms/client'
  import { writable } from 'svelte/store'
  import { categoriesFromFlavors } from '$lib/utils/flavors'
  import { toast } from 'svelte-french-toast'

  export let data: PageData

  $: flavors = data.flavors
  $: categories = categoriesFromFlavors(flavors)

  const { form, enhance, errors, constraints } = superForm(data.form, {
    applyAction: false,
    taintedMessage: null,
    dataType: 'json',
    clearOnSubmit: 'none',
    multipleSubmits: 'prevent',
    onResult: ({ result: { type } }) => {
      type === 'success'
        ? toast.success('Validation passed!')
        : toast.error('Validation failed')
    }
  })

  const nicotine = numberProxy(form, 'nicotine')
  const bottleCount = numberProxy(form, 'bottleCount')

  const flavorCount = writable<1 | 2 | 3>(1)

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
      $form.flavor2 = $form.flavor3 = $form.shots2 = $form.shots3 = null
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
      $form.flavor3 = $form.shots3 = null
      break
    case 3:
      $form.shots1 = $form.shots2 = $form.shots3 = 1
      break
  }
</script>

<PageLayout>
  <PageTitle
    title="Flavor Picker"
    slot="header"
  />

  <Form {enhance}>
    <RadioGroup
      label="Flavor Count"
      name="flavor-count"
      bind:value={$flavorCount}
      options={[
        { value: 1, label: '1 Flavor' },
        { value: 2, label: '2 Flavors' },
        { value: 3, label: '3 Flavors' }
      ]}
      horizontal
      color="purple"
    />

    <Select
      label="Flavor 1"
      name="flavor1"
      bind:value={$form.flavor1}
      options={flavor1Options}
      groups={categories}
      defaultOption={{ value: '', label: 'Select a flavor' }}
      errors={$errors.flavor1}
    />

    <RadioGroup
      name="shots1"
      bind:value={$form.shots1}
      options={$flavorCount === 3 || $form.shots2 == 2
        ? shotOptions.slice(0, 1)
        : $flavorCount === 2
        ? shotOptions.slice(0, 2)
        : shotOptions}
      errors={$errors.shots1}
      containerStyles="-mt-3"
      horizontal
      color="purple"
    />

    {#if $flavorCount > 1}
      <Select
        name="flavor2"
        label="Flavor 2"
        bind:value={$form.flavor2}
        options={flavor2Options}
        groups={categories}
        defaultOption={{ value: null, label: 'Select a flavor' }}
        errors={$errors.flavor2}
      />

      <RadioGroup
        name="shots2"
        bind:value={$form.shots2}
        options={$flavorCount === 3 || $form.shots1 == 2
          ? shotOptions.slice(0, 1)
          : shotOptions.slice(0, 2)}
        errors={$errors.shots2}
        containerStyles="-mt-3"
        horizontal
        color="purple"
      />
    {/if}

    {#if $flavorCount > 2}
      <Select
        name="flavor3"
        label="Flavor 3"
        bind:value={$form.flavor3}
        options={flavor3Options}
        groups={categories}
        defaultOption={{ value: null, label: 'Select a flavor' }}
        errors={$errors.flavor3}
      />

      <RadioGroup
        name="shots3"
        bind:value={$form.shots3}
        options={shotOptions.slice(0, 1)}
        errors={$errors.shots3}
        containerStyles="-mt-3"
        horizontal
        color="purple"
      />
    {/if}

    <div class="flex flex-wrap gap-3">
      <Input
        type="number"
        label="Nicotine level"
        name="nicotine"
        bind:value={$nicotine}
        errors={$errors.nicotine}
        {...$constraints.nicotine}
        step="any"
        containerStyles="grow"
      />

      <Input
        type="number"
        name="bottleCount"
        label="Number of bottles"
        bind:value={$bottleCount}
        errors={$errors.bottleCount}
        {...$constraints.bottleCount}
        containerStyles="grow"
      />
    </div>

    <Button
      type="submit"
      slot="actions"
      color="green">Create</Button
    >
  </Form>
</PageLayout>
