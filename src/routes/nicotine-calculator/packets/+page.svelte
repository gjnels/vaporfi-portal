<script lang="ts">
  import { onMount } from 'svelte'
  import toast from 'svelte-french-toast'
  import { writable } from 'svelte/store'
  import { superForm } from 'sveltekit-superforms/client'

  import type { PageData } from './$types'

  import { savedPackets, storeSavedPackets } from '$lib/stores/nicotinePackets'
  import { calculatePackets } from '$lib/utils/nicotinePackets'

  import { FormControl } from '$components'

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
  <title>Nicotine Packet Calculator | VF Columbus</title>
</svelte:head>

<CalculatorLayout>
  <svelte:fragment slot="form">
    <PacketList
      title="Available Packets"
      {packetPopoverContent}
    >
      <!-- Available packets list -->
      {#each $savedPackets as packet (packet.id)}
        <label class="checkbox secondary">
          <input
            type="checkbox"
            bind:checked={packet.available}
          />
          <span class="capitalize">{packet.color} - {packet.mg}mg</span>
        </label>
      {/each}
      <button
        class="btn btn-secondary btn-small mt-2"
        on:click={() => {
          const { error } = storeSavedPackets()
          error
            ? toast.error(error)
            : toast.success('Nicotine packet preferences saved.')
        }}>Save</button
      >
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

      <FormControl
        label="Final nicotine level"
        errors={$errors.final}
      >
        <input
          type="number"
          name="final"
          bind:value={$form.final}
          {...$constraints.final}
          step="any"
        />
      </FormControl>

      <label class="checkbox">
        <input
          type="checkbox"
          name="salt"
          bind:checked={$form.salt}
        />
        <span>Salt nicotine</span>
      </label>

      <div class="btn-group">
        <button
          type="submit"
          class="btn btn-primary">Calculate</button
        >
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
    {#if $result}
      {#if $result.length > 0}
        <ul class="flex flex-wrap justify-evenly gap-8 self-stretch px-4">
          {#each $result as result}
            <li class="flex flex-col gap-2 text-center">
              {#if result.type !== 'exact'}
                <p
                  class="text-lg font-medium capitalize text-surface-100 underline underline-offset-2"
                >
                  {result.type} than desired
                </p>
              {/if}
              <p>
                Nicotine level: <span
                  class="text-xl font-semibold text-surface-100"
                  >{result.finalNicLevel} mg</span
                >
              </p>
              <PacketResultList packets={result.packets} />
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-danger-400">No valid packets found</p>
      {/if}
    {:else}
      <p class="italic text-surface-500">Fill out the form</p>
    {/if}
  </svelte:fragment>
</CalculatorLayout>
