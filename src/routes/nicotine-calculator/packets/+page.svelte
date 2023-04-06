<script lang="ts">
  import { onMount } from 'svelte'
  import toast from 'svelte-french-toast'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import type { PageData } from './$types'

  import { savedPackets, storeSavedPackets } from '$lib/stores/nicotinePackets'
  import { calculatePackets } from '$lib/utils/nicotinePackets'

  import { Button } from '$components'
  import { Checkbox, Form, Input, Select } from '$components/forms'

  import CalculatorLayout from '../CalculatorLayout.svelte'
  import PacketList from '../PacketList.svelte'
  import PacketResultList from '../PacketResultList.svelte'

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
      $result = valid ? calculatePackets(data, $savedPackets) : null
    }
  })

  const result = writable<ReturnType<typeof calculatePackets> | null>(null)

  const packetPopoverContent = [
    'This list should reflect which nicotine packets are currently in stock at your location. Only selected packets will be included in the calculation',
    'You can turn any of them on or off temporarily. Click Save to keep the current preferences when you come back to this page.'
  ]
</script>

<svelte:head>
  <title>VF Portal | Nicotine Calculator - Packets</title>
</svelte:head>

<CalculatorLayout>
  <svelte:fragment slot="form">
    <PacketList
      title="Available Packets"
      {packetPopoverContent}
    >
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
    </PacketList>

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
          onclick={() => {
            reset({ keepMessage: false })
            $result = null
          }}>Reset Form</Button
        >
      </svelte:fragment>
    </Form>
  </svelte:fragment>

  <svelte:fragment slot="result">
    {#if $result}
      {#if $result.length > 0}
        <ul class="flex flex-wrap justify-evenly gap-8 self-stretch px-4">
          {#each $result as result}
            <li class="flex flex-col gap-2 text-center">
              {#if result.type !== 'exact'}
                <p
                  class="text-lg font-medium capitalize text-zinc-100 underline underline-offset-2"
                >
                  {result.type} than desired
                </p>
              {/if}
              <p>
                Nicotine level: <span
                  class="text-xl font-semibold text-zinc-100"
                  >{result.finalNicLevel} mg</span
                >
              </p>
              <PacketResultList packets={result.packets} />
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-red-400">No valid packets found</p>
      {/if}
    {:else}
      <p class="italic text-zinc-500">Fill out the form</p>
    {/if}
  </svelte:fragment>
</CalculatorLayout>
