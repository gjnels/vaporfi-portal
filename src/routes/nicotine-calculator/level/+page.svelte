<script lang="ts">
  import type { SelectedPacket } from '$lib/types/nicotinePackets.types'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'
  import { getFinalNicLevel } from '$lib/utils/nicotinePackets'

  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import CalculatorLayout from '../CalculatorLayout.svelte'
  import PacketList from '../PacketList.svelte'
  import PacketResultList from '../PacketResultList.svelte'
  import Form from '$components/Form/Form.svelte'
  import NumberInput from '$components/FormControls/NumberInput.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import FormControl from '$components/FormControls/FormControl.svelte'

  export let data

  const sForm = superForm(data.form, {
    invalidateAll: false,
    dataType: 'json',
    onUpdated: ({ form: { data, valid, message } }) => {
      const selectedPackets = data.packets.filter((packet) => packet.selected)
      $result =
        valid && !message
          ? {
              packets: selectedPackets,
              bottleSize: data.bottleSize,
              currentLevel: data.current,
              nicotine: getFinalNicLevel(selectedPackets, data.bottleSize, data.current)
            }
          : null
    }
  })
  $: ({ form, constraints, errors } = sForm)

  const result = writable<{
    packets: SelectedPacket[]
    bottleSize: number
    currentLevel: number
    nicotine: number
  } | null>(null)

  const packetPopoverContent =
    '<span>Choose which packets to add to a bottle.</span> <span>For each packet you select, enter the quantity for that packet in the corresponding input field.</span>'
</script>

<svelte:head>
  <title>Nicotine Level Calculator | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Nicotine Packet Calculator</h1>
    <span class="brightness-75">Calculate the final nicotine level based on the packets to add</span
    >
  </svelte:fragment>

  <CalculatorLayout>
    <svelte:fragment slot="form">
      <PacketList
        title="Packets to Add"
        {packetPopoverContent}
      >
        <!-- Packets list -->
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {#each data.packets as packet, idx (idx)}
            <label class="flex w-fit items-center gap-2">
              <input
                type="checkbox"
                class="checkbox"
                bind:checked={$form.packets[idx].selected}
              />
              <span class="capitalize">{packet.color} - {packet.mg}mg</span>
            </label>
          {/each}
        </div>
      </PacketList>

      <Form superForm={sForm}>
        <!-- Bottle size -->
        <Select
          form={sForm}
          field="bottleSize"
          label="Bottle Size"
        >
          <option value={30}>30 mL</option>
          <option value={50}>50 mL</option>
          <option value={60}>60 mL</option>
          <option value={100}>100 mL</option>
          <option value={120}>120 mL</option>
        </Select>

        <!-- Current nicotine level -->
        <NumberInput
          form={sForm}
          field="current"
          label="Current Nicotine Level"
          step="any"
        />

        <!-- Selected packets to add -->
        {#each $form.packets as packet, idx (packet.id)}
          {#if packet.selected}
            <FormControl
              label="Number of {packet.color[0].toUpperCase() +
                packet.color.slice(1)} ({packet.mg}mg) Packets"
              errors={$errors.packets?.[idx]?.count}
            >
              <input
                type="number"
                class="input"
                bind:value={packet.count}
                {...$constraints.packets?.count}
              />
            </FormControl>
          {/if}
        {/each}

        <svelte:fragment slot="actions">
          <button
            type="button"
            class="btn variant-filled-surface hover:variant-filled"
            on:click={() => {
              sForm.reset({ keepMessage: false })
              $result = null
            }}>Reset</button
          >
          <button
            type="submit"
            class="btn variant-filled-primary"
          >
            Calculate
          </button>
        </svelte:fragment>
      </Form>

      <!-- <form
        method="post"
        use:enhance
        class="form grow self-start"
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

        <div class="form-actions flex flex-wrap items-center gap-4">
          <FormMessage message={$message} />
          <div class="ml-auto flex flex-wrap gap-4">
            <button
              type="submit"
              class="btn-primary btn"
            >
              Calculate
            </button>
            <button
              type="button"
              class="btn"
              on:click={() => {
                reset({ keepMessage: false })
                $result = null
              }}>Reset</button
            >
          </div>
        </div>
      </form> -->
    </svelte:fragment>

    <svelte:fragment slot="result">
      {#if $result !== null}
        <div class="text-xl">
          <span class="font-medium text-secondary-600-300-token">{$result.bottleSize}mL</span>
          starting at
          <span class="font-medium text-secondary-600-300-token">{$result.currentLevel}mg</span>
        </div>
        <PacketResultList packets={$result.packets} />
        <div class="flex items-end gap-2">
          <span class="text-2xl">Total:</span>
          <span class="text-3xl font-bold text-primary-600 dark:text-primary-500">
            {$result.nicotine}mg
          </span>
        </div>
      {:else}
        <p class="italic brightness-50">Fill out the form</p>
      {/if}
    </svelte:fragment>
  </CalculatorLayout>
</PageLayout>
