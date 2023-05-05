<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore } from '@skeletonlabs/skeleton'
  import { savedPackets, storeSavedPackets } from '$lib/stores/nicotinePackets'
  import { calculatePackets } from '$lib/utils/nicotinePackets'

  import CalculatorLayout from '../CalculatorLayout.svelte'
  import PacketList from '../PacketList.svelte'
  import PacketResultList from '../PacketResultList.svelte'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import Form from '$components/Form/Form.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import NumberInput from '$components/FormControls/NumberInput.svelte'
  import Checkbox from '$components/FormControls/Checkbox.svelte'

  export let data

  onMount(() => {
    // Validate all stored packets match packets from database
    $savedPackets = data.packets.map((packet) => {
      const existing = $savedPackets.find((p) => p.id === packet.id)
      if (existing) return existing
      return { ...packet, available: true }
    })
  })

  const sForm = superForm(data.form, {
    invalidateAll: false,
    onUpdated: ({ form: { data, valid } }) => {
      $result = valid ? calculatePackets(data, $savedPackets) : null
    }
  })

  const result = writable<ReturnType<typeof calculatePackets> | null>(null)

  const packetPopoverContent =
    '<span>This list should reflect which nicotine packets are currently in stock at your location. Only selected packets will be included in the calculation.</span> <span>You can turn any of them on or off temporarily. Click Save to keep the current preferences when you come back to this page.</span>'
</script>

<svelte:head>
  <title>Nicotine Packet Calculator | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Nicotine Level Calculator</h1>
    <span class="brightness-75"
      >Calculate the total number of packets needed to get to a specific nicotine level</span
    >
  </svelte:fragment>
  <CalculatorLayout>
    <svelte:fragment slot="form">
      <PacketList
        title="Available Packets"
        {packetPopoverContent}
      >
        <!-- Available packets list -->
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {#if $savedPackets.length === 0}
            {#each Array(10).fill(null) as placeholder}
              <div class="placeholder my-1 animate-pulse" />
            {/each}
          {:else}
            {#each $savedPackets as packet (packet.id)}
              <label class="flex w-fit items-center gap-2">
                <input
                  type="checkbox"
                  class="checkbox"
                  bind:checked={packet.available}
                />
                <span class="capitalize">{packet.color} - {packet.mg}mg</span>
              </label>
            {/each}
          {/if}
        </div>

        <svelte:fragment slot="actions">
          <button
            type="button"
            class="btn btn-sm variant-filled-secondary ml-auto flex"
            on:click={() => {
              const { error } = storeSavedPackets()
              error
                ? toastStore.trigger({ message: error, background: 'variant-filled-error' })
                : toastStore.trigger({
                    message: 'Nicotine packet preferences saved.',
                    background: 'variant-filled-success'
                  })
            }}>Save</button
          >
        </svelte:fragment>
      </PacketList>

      <Form superForm={sForm}>
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

        <NumberInput
          form={sForm}
          field="current"
          label="Current Nicotine Level"
          step="any"
        />

        <NumberInput
          form={sForm}
          field="final"
          label="Final Nicotine Level"
          step="any"
        />

        <Checkbox
          form={sForm}
          field="salt"
          label="Salt Nicotine"
        />

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
            class="btn variant-filled-primary">Calculate</button
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
                  <h5 class="capitalize underline underline-offset-2">
                    {result.type} than desired
                  </h5>
                {/if}
                <div>
                  Nicotine level: <span
                    class="text-2xl font-bold text-primary-700 dark:text-primary-500"
                    >{result.finalNicLevel} mg</span
                  >
                </div>
                <PacketResultList packets={result.packets} />
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-error-500-400-token">No valid packets found</p>
        {/if}
      {:else}
        <p class="italic brightness-50">Fill out the form</p>
      {/if}
    </svelte:fragment>
  </CalculatorLayout>
</PageLayout>
