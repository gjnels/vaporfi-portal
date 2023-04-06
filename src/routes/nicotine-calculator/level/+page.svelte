<script lang="ts">
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import type { PageData } from './$types'

  import type { SelectedPacket } from '$lib/types/nicotinePackets.types'
  import { getFinalNicLevel } from '$lib/utils/nicotinePackets'

  import { Button } from '$components'
  import { Checkbox, Form, Input, Select } from '$components/forms'

  import CalculatorLayout from '../CalculatorLayout.svelte'
  import PacketList from '../PacketList.svelte'
  import PacketResultList from '../PacketResultList.svelte'

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

  const packetPopoverContent = [
    'Choose which packets you want to add to a bottle from this list.',
    'For each packet you select, enter the quantity for that packet in the corresponding input field.'
  ]
</script>

<svelte:head>
  <title>Nicotine Level Calculator | VF Columbus</title>
</svelte:head>

<CalculatorLayout>
  <svelte:fragment slot="form"
    ><PacketList
      title="Packet to Add"
      {packetPopoverContent}
    >
      <!-- Packets list -->
      {#each data.packets as packet, idx (idx)}
        <Checkbox
          label="{packet.color} - {packet.mg}mg"
          name="packet"
          labelStyles="capitalize"
          bind:checked={$form.packets[idx].selected}
        />
      {/each}
    </PacketList>

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
    </Form></svelte:fragment
  >

  <svelte:fragment slot="result">
    {#if $result !== null}
      <p class="text-xl text-zinc-100">
        <span class="font-medium text-violet-300">{$result.bottleSize}mL</span>
        starting at
        <span class="font-medium text-violet-300">{$result.currentLevel}mg</span
        >
      </p>
      <PacketResultList packets={$result.packets} />
      <p class="flex items-end gap-2">
        <span class="text-2xl">Total:</span>
        <span class="text-3xl font-bold text-green-400">
          {$result.nicotine}mg
        </span>
      </p>
    {:else}
      <p class="italic text-zinc-500">Fill out the form</p>
    {/if}
  </svelte:fragment>
</CalculatorLayout>
