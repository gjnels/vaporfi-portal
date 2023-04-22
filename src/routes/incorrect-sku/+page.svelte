<script lang="ts">
  import toast from 'svelte-french-toast'
  import { superForm } from 'sveltekit-superforms/client'

  import { FormControl, FormMessage, PageLayout } from '$components'

  export let data

  const { form, enhance, message, errors, constraints, reset } = superForm(
    data.form,
    {
      onResult: ({ result: { type } }) => {
        if (type === 'success') {
          toast.success('SKU submitted for review.')
        }
      }
    }
  )
</script>

<svelte:head>
  <title>Incorrect SKU | VF Columbus</title>
</svelte:head>

<PageLayout headerContainerStyles="flex-col items-start gap-2">
  <svelte:fragment slot="header">
    <h1>Incorrect SKUs</h1>
    <span class="text-surface-300"
      >Submit SKUs which are ringing up an incorrect item. If the SKU rings up
      nothing, submit a <a
        href="/missing-sku"
        class="link link-secondary inline-flex">missing sku</a
      > instead.</span
    >
  </svelte:fragment>

  <div class="flex flex-col flex-wrap gap-10 xl:flex-row">
    <!-- new incorrect sku form -->
    <form
      method="post"
      use:enhance
      class="form flex-1"
    >
      {#if $form.submitted_by_profile_id}
        <input
          type="hidden"
          name="submitted_by_profile_id"
          hidden
          bind:value={$form.submitted_by_profile_id}
        />
      {/if}

      <FormControl
        label="Incorrect Item Name"
        errors={$errors.incorrect_item_name}
      >
        <input
          type="text"
          name="incorrect_item_name"
          placeholder="Which item currently rings up when this SKU is scanned?"
          bind:value={$form.incorrect_item_name}
          {...$constraints.incorrect_item_name}
        />
      </FormControl>

      <FormControl
        label="Correct Item Name"
        errors={$errors.correct_item_name}
      >
        <input
          type="text"
          name="correct_item_name"
          placeholder="Which item should ring up when this SKU is scanned?"
          bind:value={$form.correct_item_name}
          {...$constraints.correct_item_name}
        />
      </FormControl>

      <div class="flex flex-col gap-1">
        <span class="text-sm text-warning-400"
          >Fill out this field last when using a barcode scanner. Scanning an
          item will submit the form.</span
        >
        <FormControl
          label="SKU"
          errors={$errors.sku}
        >
          <input
            type="text"
            name="sku"
            placeholder="e.g. 819905029982"
            bind:value={$form.sku}
            {...$constraints.sku}
          />
        </FormControl>
      </div>

      <FormControl
        label="Current Location"
        errors={$errors.submitted_from_location_id}
      >
        <select
          bind:value={$form.submitted_from_location_id}
          name="submitted_from_location_id"
          class:placeholder={$form.submitted_from_location_id === -1}
          {...$constraints.submitted_from_location_id}
        >
          <option value={-1}>Select your current location</option>
          {#each data.locations as location (location.id)}
            <option value={location.id}>{location.name}</option>
          {/each}
        </select>
      </FormControl>

      <FormControl
        label="Your Name"
        errors={$errors.submitted_by_name}
      >
        <input
          type="text"
          name="submitted_by_name"
          placeholder="Who is submitting this incorrect SKU?"
          bind:value={$form.submitted_by_name}
          {...$constraints.submitted_by_name}
        />
      </FormControl>

      <FormControl
        label="Notes"
        errors={$errors.notes}
      >
        <textarea
          rows={3}
          name="notes"
          placeholder="Any important details to share about this incorrect SKU?"
          bind:value={$form.notes}
        />
      </FormControl>

      <div class="form-actions flex flex-wrap items-center gap-4">
        <FormMessage message={$message} />

        <div class="ml-auto flex flex-wrap gap-2">
          <button
            type="submit"
            class="btn btn-primary">Submit</button
          >
          <button
            type="button"
            class="btn"
            on:click={() => reset({ keepMessage: false })}>Reset</button
          >
        </div>
      </div>
    </form>

    <!-- list of pending incorrect skus (if any) -->
    <div class="flex flex-1 flex-col gap-6">
      <h2 class="text-2xl font-semibold">Pending Incorrect SKUs</h2>
      {#if data.pendingItems.length === 0}
        <span class="italic text-surface-400">No pending items found</span>
      {:else}
        <div class="styled-table">
          <table>
            <thead>
              <tr>
                <th>Incorrect Item</th>
                <th>Correct Item</th>
                <th>SKU</th>
              </tr>
            </thead>
            <tbody>
              {#each data.pendingItems as pendingItem (pendingItem.id)}
                <tr>
                  <td>{pendingItem.incorrect_item_name}</td>
                  <td>{pendingItem.correct_item_name}</td>
                  <td>{pendingItem.sku}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</PageLayout>
