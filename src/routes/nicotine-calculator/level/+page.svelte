<script lang="ts">
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import type { SelectedPacket } from '$lib/types/nicotinePackets.types'
  import { getFinalNicLevel } from '$lib/utils/nicotinePackets'

  import { FormControl } from '$components'

  import CalculatorLayout from '../CalculatorLayout.svelte'
  import PacketList from '../PacketList.svelte'
  import PacketResultList from '../PacketResultList.svelte'

  export let data

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
    'Choose which packets to add to a bottle.',
    'For each packet you select, enter the quantity for that packet in the corresponding input field.'
  ]
</script>

<svelte:head>
  <title>Nicotine Level Calculator | VF Columbus</title>
</svelte:head>

<CalculatorLayout>
  <svelte:fragment slot="form">
    <PacketList
      title="Packets to Add"
      {packetPopoverContent}
    >
      <!-- Packets list -->
      <div class="grid gap-1 self-center">
        {#each data.packets as packet, idx (idx)}
          <label class="checkbox secondary">
            <input
              type="checkbox"
              bind:checked={$form.packets[idx].selected}
            />
            <span class="capitalize">{packet.color} - {packet.mg}mg</span>
          </label>
        {/each}
      </div>
    </PacketList>

    <form
      method="post"
      use:enhance
      class="form grow"
    >
      <FormControl
        label="Bottle size"
        errors={$errors.bottleSize}
      >
        <select
          name="bottleSize"
          bind:value={$form.bottleSize}
          {...$constraints.bottleSize}
        >
          <option value={30}>30 mL</option>
          <option value={50}>50 mL</option>
          <option value={60}>60 mL</option>
          <option value={100}>100 mL</option>
          <option value={120}>120 mL</option>
        </select>
      </FormControl>

      <FormControl
        label="Current nicotine level"
        errors={$errors.current}
      >
        <input
          type="number"
          name="current"
          bind:value={$form.current}
          {...$constraints.current}
          step="any"
        />
      </FormControl>

      {#each $form.packets as packet, idx (packet.id)}
        {#if packet.selected}
          <FormControl
            label="Number of {packet.color[0].toUpperCase() +
              packet.color.slice(1)} ({packet.mg}mg) Packets"
            errors={$errors.packets?.[idx]?.count}
          >
            <input
              type="number"
              bind:value={packet.count}
              {...$constraints.packets?.count}
            />
          </FormControl>
        {/if}
      {/each}

      {#if $message}
        <span class="form-error">{$message}</span>
      {/if}

      <div class="flex flex-wrap gap-4 [&>*]:flex-1">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Calculate
        </button>
        <button
          type="button"
          class="btn"
          on:click={() => {
            reset({ keepMessage: false })
            $result = null
          }}>Reset Form</button
        >
      </div>
    </form>
  </svelte:fragment>

  <svelte:fragment slot="result">
    {#if $result !== null}
      <p class="text-xl text-surface-100">
        <span class="font-medium text-secondary-300"
          >{$result.bottleSize}mL</span
        >
        starting at
        <span class="font-medium text-secondary-300"
          >{$result.currentLevel}mg</span
        >
      </p>
      <PacketResultList packets={$result.packets} />
      <p class="flex items-end gap-2">
        <span class="text-2xl">Total:</span>
        <span class="text-3xl font-bold text-primary-400">
          {$result.nicotine}mg
        </span>
      </p>
    {:else}
      <p class="italic text-surface-500">Fill out the form</p>
    {/if}
  </svelte:fragment>
</CalculatorLayout>
