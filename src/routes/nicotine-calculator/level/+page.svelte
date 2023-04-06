<script lang="ts">
  import { Icon, InformationCircle } from 'svelte-hero-icons'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import type { PageData } from './$types'

  import type { SelectedPacket } from '$lib/types/nicotinePackets.types'
  import { getFinalNicLevel } from '$lib/utils/nicotinePackets'

  import { Button, Divider, Link } from '$components'
  import { Checkbox, Form, Input, Select } from '$components/forms'

  import PacketList from '../PacketList.svelte'

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

<div class="flex flex-col-reverse gap-12 lg:flex-row">
  <!-- Available packets and form -->
  <div class="flex grow flex-wrap gap-6">
    <!-- Available packets -->
    <div class="flex w-fit flex-col gap-0.5">
      <!-- Available packets header -->
      <div class="relative flex items-center gap-1">
        <h2 class="text-lg font-medium text-zinc-100">Packets to Add</h2>
        <Button
          color="green"
          icon
          transparent
          styles="p-0.5"
          ><Icon
            src={InformationCircle}
            size="1.25rem"
          /></Button
        >
      </div>

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

  <div class="flex grow flex-col items-center gap-2">
    <h2 class="text-2xl font-semibold">Results</h2>
    <Divider styles="self-stretch" />
    {#if $result !== null}
      <p class="text-xl text-zinc-100">
        {$result.bottleSize}mL starting at {$result.currentLevel}mg
      </p>
      <PacketList packets={$result.packets} />
      <p class="text-4xl font-semibold text-zinc-100">{$result.nicotine}mg</p>
    {:else}
      <p class="px-4 italic text-zinc-500">
        Fill out the form to see the results
      </p>
    {/if}
  </div>
</div>
