<script lang="ts">
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
  import type { Validation } from 'sveltekit-superforms/index'
  import type { ModalProps } from '@skeletonlabs/skeleton/dist/utilities/Modal/Modal.svelte'
  import type { fixSkuSchema } from '$lib/schemas/skus'
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore } from '@skeletonlabs/skeleton'

  import Form from '$components/Form/Form.svelte'

  // Exposes modalStore parent props to this component
  export let parent: ModalProps

  type Sku = $$Generic<DatabaseRow<'incorrect_skus'> | DatabaseRow<'missing_skus'>>

  export let sku: Sku
  export let form: Validation<typeof fixSkuSchema>

  const isMissingSku = (
    sku: DatabaseRow<'incorrect_skus'> | DatabaseRow<'missing_skus'>
  ): sku is DatabaseRow<'missing_skus'> => 'item_name' in sku

  const sForm = superForm(form, {
    onResult: ({ result }) => {
      if (result.type === 'success' || result.type === 'redirect') {
        parent.onClose()
        toastStore.trigger({
          message: `${
            isMissingSku(sku) ? sku.item_name : sku.correct_item_name
          } has been marked as ${sku.fixed ? 'NOT FIXED' : 'FIXED'}.`,
          background: sku.fixed ? 'variant-filled-warning' : 'variant-filled-success'
        })
      }
    }
  })

  const { form: formStore } = sForm
  $formStore.id = sku.id
  $formStore.fixed = !sku.fixed
</script>

<!-- Default slot to prevent modal warning -->
<slot />

<Form
  action="?/update"
  superForm={sForm}
>
  <div class="max-auto grid max-w-lg grid-cols-[auto,_1fr] gap-3">
    {#if isMissingSku(sku)}
      <span class="text-right brightness-90">Item Name:</span>
      <span>{sku.item_name}</span>
    {:else}
      <span class="text-right brightness-90">Incorrect Item:</span>
      <span>{sku.incorrect_item_name}</span>
      <span class="text-right brightness-90">Correct Item:</span>
      <span>{sku.correct_item_name}</span>
    {/if}
    <span class="text-right brightness-90">SKU:</span>
    <span class="font-semibold">{sku.sku}</span>
    {#if sku.notes}
      <span class="text-right brightness-90">Notes:</span>
      <span>{sku.notes}</span>
    {/if}
    <span class="text-right brightness-90">Fixed:</span>
    <span class={sku.fixed ? 'text-success-500' : 'text-error-500'}>{sku.fixed ? 'Yes' : 'No'}</span
    >
  </div>

  <input
    hidden
    type="hidden"
    id="id"
    name="id"
    class="absolute -left-[9999px] hidden h-0 w-0"
    value={sku.id}
  />

  <input
    hidden
    type="checkbox"
    id="fixed"
    name="fixed"
    class="absolute -left-[9999px] hidden h-0 w-0"
    checked={!sku.fixed}
  />

  <svelte:fragment slot="actions">
    <button
      type="button"
      class="btn variant-filled-surface hover:variant-filled"
      on:click={() => {
        parent.onClose()
        sForm.reset({ keepMessage: false })
      }}>Cancel</button
    >
    <button
      type="submit"
      class="btn {sku.fixed ? 'variant-filled-warning' : 'variant-filled-success'}"
      >Mark {sku.fixed ? 'Not Fixed' : 'Fixed'}</button
    >
  </svelte:fragment>
</Form>
