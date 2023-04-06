<script lang="ts">
  import { onMount } from 'svelte'
  import toast from 'svelte-french-toast'
  import { Icon, InformationCircle } from 'svelte-hero-icons'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import type { PageData } from './$types'

  import { savedPackets, storeSavedPackets } from '$lib/stores/nicotinePackets'
  import { calculatePackets, packetColors } from '$lib/utils/nicotinePackets'

  import { Button, Divider, Link } from '$components'
  import { Checkbox, Form, Input, Select } from '$components/forms'

  export let data: PageData

  onMount(() => {
    // Validate all stored packets match packets from database
    $savedPackets = data.packets.map((packet) => {
      const existing = $savedPackets.find((p) => p.id === packet.id)
      if (existing) return existing
      return { ...packet, available: true }
    })
  })

  const { form, enhance, errors, constraints, reset } = superForm(data.form, {
    invalidateAll: false,
    clearOnSubmit: 'none',
    onUpdated: ({ form: { data, valid } }) => {
      $results = valid ? calculatePackets(data, $savedPackets) : null
    }
  })

  const results = writable<ReturnType<typeof calculatePackets> | null>(null)
</script>

<svelte:head>
  <title>VF Portal | Nicotine Calculator - Packets</title>
</svelte:head>

<div class="flex flex-col gap-12 lg:flex-row">
  <!-- Available packets and form -->
  <div class="flex flex-wrap gap-6 lg:grow">
    <!-- Available packets -->
    <div class="flex w-fit flex-col gap-0.5">
      <!-- Available packets header -->
      <div class="relative flex items-end gap-1">
        <h2 class="text-lg font-medium">Available Packets</h2>
        <Button
          color="green"
          icon
          transparent
          ><Icon
            src={InformationCircle}
            size="1.25rem"
          /></Button
        >
      </div>

      <!-- Available packets list -->
      {#each $savedPackets as packet (packet.id)}
        <Checkbox
          name="packet"
          label={`${packet.color} - ${packet.mg}mg`}
          bind:checked={packet.available}
          labelStyles="capitalize"
        />
      {/each}
      <Button
        color="purple"
        small
        styles="mt-2"
        onclick={() => {
          const { error } = storeSavedPackets()
          error
            ? toast.error(error)
            : toast.success('Nicotine packet preferences saved.')
        }}>Save</Button
      >
    </div>

    <Form
      {enhance}
      styles="grow"
    >
      <Select
        name="bottleSize"
        label="Bottle Size"
        bind:value={$form.bottleSize}
        options={[
          { value: 30, label: '30 mL' },
          { value: 50, label: '50 mL' },
          { value: 60, label: '60 mL' },
          { value: 100, label: '100 mL' },
          { value: 120, label: '120 mL' }
        ]}
        errors={$errors.bottleSize}
        constraints={$constraints.bottleSize}
      />

      <Input
        type="number"
        name="current"
        label="Current Nicotine Level"
        bind:value={$form.current}
        errors={$errors.current}
        constraints={$constraints.current}
        step="any"
      />

      <Input
        type="number"
        name="final"
        label="Final Nicotine Level"
        bind:value={$form.final}
        errors={$errors.final}
        constraints={$constraints.final}
        step="any"
      />

      <Checkbox
        name="salt"
        label="Salt nicotine"
        bind:checked={$form.salt}
        errors={$errors.salt}
      />

      <svelte:fragment slot="actions">
        <Button
          type="submit"
          color="green">Calculate</Button
        >
        <Button
          color="gray"
          onclick={reset}>Reset Form</Button
        >
      </svelte:fragment>

      <svelte:fragment slot="links">
        <Link href="level">Calculate Final Nicotine Level</Link>
      </svelte:fragment>
    </Form>
  </div>

  <div class="flex grow flex-col items-center gap-2">
    <h2 class="text-2xl font-semibold">Results</h2>
    <Divider styles="self-stretch" />
    {#if $results}
      {#if $results.length > 0}
        <ul
          class="flex w-full flex-wrap justify-center gap-x-20 gap-y-10 px-4 text-lg"
        >
          {#each $results as packets}
            <li class="flex flex-col gap-2 text-center">
              {#if packets.type !== 'exact'}
                <p class="capitalize underline underline-offset-2">
                  {packets.type} than desired
                </p>
              {/if}
              <p>
                Nicotine level: <span class="text-xl font-semibold"
                  >{packets.finalNicLevel} mg</span
                >
              </p>
              {#each packets.packets as { color, count, mg }}
                <div
                  class="rounded-lg border-[3px] {packetColors[
                    color.toLowerCase()
                  ]} bg-zinc-900 p-2 text-center font-semibold text-white"
                >
                  <p class="capitalize">{color} - {mg}mg</p>
                  <p>Qty &times; {count}</p>
                </div>
              {/each}
            </li>
          {/each}
        </ul>
      {:else}
        <p class="px-4 italic">No valid packets found</p>
      {/if}
    {:else}
      <p class="px-4 italic text-zinc-500">
        Fill out the form to see the results
      </p>
    {/if}
  </div>
</div>
