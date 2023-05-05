<script lang="ts">
  import { toastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'

  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import Form from '$components/Form/Form.svelte'
  import TextInput from '$components/FormControls/TextInput.svelte'
  import Select from '$components/FormControls/Select.svelte'
  import Textarea from '$components/FormControls/Textarea.svelte'

  export let data

  const sForm = superForm(data.form, {
    onResult: ({ result: { type } }) => {
      if (type === 'success') {
        toastStore.trigger({
          message: 'SKU submitted for review.',
          background: 'variant-filled-success'
        })
      }
    }
  })

  $: ({ form } = sForm)
</script>

<svelte:head>
  <title>Incorrect SKU | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Incorrect SKUs</h1>
    <span
      >Submit SKUs which are ringing up an incorrect item. If the SKU rings up nothing, submit a <a
        href="/missing-sku">missing sku</a
      > instead.</span
    >
  </svelte:fragment>

  <div class="grid gap-10 xl:grid-cols-2">
    <!-- new incorrect sku form -->
    <Form superForm={sForm}>
      {#if $form.submitted_by_profile_id}
        <input
          type="hidden"
          name="submitted_by_profile_id"
          hidden
          bind:value={$form.submitted_by_profile_id}
        />
      {/if}

      <TextInput
        form={sForm}
        field="incorrect_item_name"
        label="Incorrect Item Name"
        placeholder="Which item currently rings up when this SKU is scanned?"
      />

      <TextInput
        form={sForm}
        field="correct_item_name"
        label="Correct Item Name"
        placeholder="Which item should ring up when this SKU is scanned?"
      />

      <TextInput
        form={sForm}
        field="sku"
        label="SKU"
        placeholder="e.g. 819905029982"
      />

      <Select
        form={sForm}
        field="submitted_from_location_id"
        label="Current Location"
      >
        <option value={-1}>Select your current location</option>
        {#each data.locations as location (location.id)}
          <option value={location.id}>{location.name}</option>
        {/each}
      </Select>

      <TextInput
        form={sForm}
        field="submitted_by_name"
        label="Your Name"
        placeholder="Who is submitting this incorrect SKU?"
      />

      <Textarea
        form={sForm}
        field="notes"
        label="Notes"
        placeholder="Any details to add about this incorrect sku?"
      />

      <svelte:fragment slot="actions">
        <button
          type="button"
          class="btn variant-filled-surface hover:variant-filled"
          on:click={() => sForm.reset({ keepMessage: false })}>Reset</button
        >
        <button
          type="submit"
          class="btn variant-filled-primary">Submit</button
        >
      </svelte:fragment>
    </Form>

    <!-- list of pending incorrect skus (if any) -->
    <div class="space-y-4">
      <h3>Pending Incorrect SKUs</h3>
      {#if data.pendingItems.length === 0}
        <p class="italic brightness-50">No pending items found</p>
      {:else}
        <div class="table-container">
          <table class="table">
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
