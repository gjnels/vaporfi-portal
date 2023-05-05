<script lang="ts">
  import type { skuIdSchema, fixSkuSchema } from '$lib/schemas/skus'
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { Icon, XCircle, CheckCircle, Trash } from 'svelte-hero-icons'
  import type { Validation } from 'sveltekit-superforms/index'
  import UpdateSkuModal from './UpdateSkuModal.svelte'
  import DeleteSkuModal from './DeleteSkuModal.svelte'

  type SkuType = $$Generic<'missing' | 'incorrect'>

  type Sku = (SkuType extends 'missing'
    ? DatabaseRow<'missing_skus'>
    : DatabaseRow<'incorrect_skus'> | DatabaseRow<'missing_skus'>) & {
    submitted_from: Pick<DatabaseRow<'locations'>, 'name'> | null
    submitted_by: Pick<DatabaseRow<'profiles'>, 'name' | 'email'> | null
  }

  export let type: SkuType
  export let skus: Sku[]
  export let updateForm: Validation<typeof fixSkuSchema>
  export let deleteForm: Validation<typeof skuIdSchema>

  const isMissingSku = (
    sku: DatabaseRow<'incorrect_skus'> | DatabaseRow<'missing_skus'>
  ): sku is DatabaseRow<'missing_skus'> => type === 'missing'

  const onUpdate = (sku: Sku) => {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: UpdateSkuModal,
        props: { form: updateForm, sku }
      }
    })
  }
  const onDelete = (sku: Sku) => {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: DeleteSkuModal,
        props: { form: deleteForm, sku }
      }
    })
  }
</script>

<div class="table-container">
  <table class="table-interactive table">
    <thead>
      <tr>
        <th />
        {#if type === 'missing'}
          <th>Item Name</th>
        {:else}
          <th>Incorrect Item Name</th>
          <th>Correct Item Name</th>
        {/if}
        <th>SKU</th>
        <th>Submitted From</th>
        <th>Submitted By</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      {#each skus as sku (sku.id)}
        {@const submitted_from = sku.submitted_from ? sku.submitted_from.name : null}
        {@const submitted_by = sku.submitted_by
          ? `${sku.submitted_by.name || sku.submitted_by_name || 'no name'} (${
              sku.submitted_by.email
            })`
          : sku.submitted_by_name || null}
        <tr on:click={() => onUpdate(sku)}>
          <td>
            <div class="flex justify-center gap-3">
              <button
                type="button"
                class="btn btn-icon btn-icon-sm {sku.fixed
                  ? 'variant-soft-warning hover:variant-filled-warning'
                  : 'variant-soft-success hover:variant-filled-success'}"
                title="Mark this SKU as {sku.fixed ? 'not fixed' : 'fixed'}"
                on:click|stopPropagation={() => onUpdate(sku)}
                ><Icon
                  src={sku.fixed ? XCircle : CheckCircle}
                  size="1.5em"
                  solid
                /></button
              >
              <button
                type="button"
                class="btn btn-icon btn-icon-sm variant-soft-error hover:variant-filled-error"
                title="Delete this record"
                on:click|stopPropagation={() => onDelete(sku)}
                ><Icon
                  src={Trash}
                  size="1.5em"
                  solid
                /></button
              >
            </div>
          </td>
          {#if isMissingSku(sku)}
            <td>{sku.item_name}</td>
          {:else}
            <td>{sku.incorrect_item_name}</td>
            <td>{sku.correct_item_name}</td>
          {/if}
          <td>{sku.sku}</td>
          <td class:brightness-50={!submitted_from}>{submitted_from ?? 'location was removed'}</td>
          <td class:brightness-50={!submitted_by}>{submitted_by ?? 'not entered'}</td>
          <td
            class="max-w-sm overflow-hidden text-ellipsis"
            class:brightness-50={!sku.notes}>{sku.notes || 'none'}</td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
