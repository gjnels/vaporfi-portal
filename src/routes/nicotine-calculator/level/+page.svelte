<script lang="ts">
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

  import type { PageData } from './$types'

  import type { SelectedPacket } from '$lib/types/nicotinePackets.types'
  import { getFinalNicLevel, packetColors } from '$lib/utils/nicotinePackets'

  import { Button, Divider, Link } from '$components'
  import { Checkbox, Form, Input, Select } from '$components/forms'

  export let data: PageData

  const { form, enhance, errors, constraints, message, reset } = superForm(
    data.form,
    {
      invalidateAll: false,
      clearOnSubmit: 'none',
      dataType: 'json',
      onUpdated: ({ form: { data, valid, message } }) => {
        const selectedPackets = data.packets.filter((packet) => packet.selected)
        $result =
          valid && !message
            ? {
                packets: selectedPackets,
                bottleSize: data.bottleSize,
                currentLevel: data.current,
                nicotine: getFinalNicLevel(
                  selectedPackets,
                  data.bottleSize,
                  data.current
                )
              }
            : null
      }
    }
  )

  const result = writable<{
    packets: SelectedPacket[]
    bottleSize: number
    currentLevel: number
    nicotine: number
  } | null>(null)
</script>

<svelte:head>
  <title>VF Portal | Nicotine Calculator - Level</title>
</svelte:head>

<!-- <SuperDebug data={$form} /> -->

<!-- sdnfjkdewfew -->
<div class="flex flex-col gap-12 lg:flex-row">
  <!-- Available packets and form -->
  <div class="flex grow flex-wrap gap-6">
    <!-- Available packets -->
    <div class="flex w-fit flex-col gap-0.5">
      <!-- Available packets header -->
      <h2 class="text-lg font-medium">Packets to Add</h2>

      <!-- Packets list -->
      {#each data.packets as packet, idx (idx)}
        <Checkbox
          label="{packet.color} - {packet.mg}mg"
          name="packet"
          labelStyles="capitalize"
          bind:checked={$form.packets[idx].selected}
        />
      {/each}
    </div>

    <Form
      {enhance}
      styles="grow"
      formError={$message}
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

      {#each $form.packets.filter((packet) => packet.selected) as packet (packet.id)}
        <Input
          type="number"
          name="packet"
          label="Number of {packet.color[0].toUpperCase() +
            packet.color.slice(1)} ({packet.mg}mg) Packets"
          bind:value={packet.count}
        />
      {/each}

      <svelte:fragment slot="actions">
        <Button
          type="submit"
          color="green"
        >
          Calculate
        </Button>
        <Button
          color="gray"
          onclick={() => {
            reset({ keepMessage: false })
            $result = null
          }}>Reset Form</Button
        >
      </svelte:fragment>

      <svelte:fragment slot="links">
        <Link href="packets">Calculate Total Packets Needed</Link>
      </svelte:fragment>
    </Form>
  </div>

  <div class="flex grow flex-col items-center gap-4">
    <h2 class="text-2xl font-semibold">Results</h2>
    <Divider styles="self-stretch" />
    {#if $result !== null}
      <p class="text-2xl text-white">
        {$result.bottleSize}mL starting at {$result.currentLevel}mg
      </p>
      <div
        class="grid grid-cols-[auto,_1fr] items-center gap-4 text-center text-lg font-semibold text-white"
      >
        {#each $result.packets as packet, idx (idx)}
          {@const color = packet.color.toLowerCase()}
          <p class="justify-self-end text-xl">{packet.count} &times;</p>
          <div
            class="rounded-lg border-[3px] {packetColors[
              color
            ]} bg-zinc-900 p-2"
          >
            <p class="capitalize">{color} - {packet.mg}mg</p>
          </div>
        {/each}
      </div>
      <p class="text-4xl font-semibold text-white">{$result.nicotine}mg</p>
    {:else}
      <p class="px-4 italic opacity-75">Fill out the form to see the results</p>
    {/if}
  </div>
</div>
