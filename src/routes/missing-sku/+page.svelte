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
  <title>Missing SKU | VF Columbus</title>
</svelte:head>

<PageLayout headerContainerStyles="flex-col items-start gap-0">
  <svelte:fragment slot="header">
    <h1 class="mb-2">Missing SKUs</h1>
    <span class="text-surface-300"
      >Submit SKUs which ring up nothing. If the SKU rings up the wrong item,
      submit an <a
        href="/incorrect-sku"
        class="link link-secondary inline-flex">incorrect sku</a
      > instead.</span
    >
  </svelte:fragment>

  <div class="flex flex-col gap-10 xl:flex-row">
    <!-- new missing sku form -->
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
        label="Item Name"
        errors={$errors.item_name}
      >
        <input
          type="text"
          name="item_name"
          placeholder="Which item should ring up when this SKU is scanned?"
          bind:value={$form.item_name}
          {...$constraints.item_name}
        />
      </FormControl>

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
          placeholder="Any important details to share about this missing SKU?"
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

    <!-- list of pending missing skus (if any) -->
    <div class="flex flex-1 flex-col gap-6">
      <h2 class="text-2xl font-semibold">Pending Missing SKUs</h2>
      {#if data.pendingItems.length === 0}
        <span class="italic text-surface-400">No pending items found</span>
      {:else}
        <div class="overflow-auto rounded-lg">
          <table class="w-full">
            <thead class="bg-surface-700 text-left">
              <tr class="font-semibold text-surface-300 [&>*]:p-4">
                <th>Item</th>
                <th>SKU</th>
              </tr>
            </thead>
            <tbody>
              {#each data.pendingItems as pendingItem (pendingItem.id)}
                <tr
                  class="whitespace-pre border-b border-surface-700 bg-surface-800 transition last:border-none hover:bg-surface-950 [&>*]:p-4"
                >
                  <td>{pendingItem.item_name}</td>
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
