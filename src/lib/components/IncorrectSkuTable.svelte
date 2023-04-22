<script lang="ts">
  import toast from 'svelte-french-toast'
  import { CheckCircle, Icon, Trash, XCircle } from 'svelte-hero-icons'

  import { enhance } from '$app/forms'

  import type { DatabaseRow } from '../types/supabaseHelpers.types'

  type IncorrectSku = DatabaseRow<'incorrect_skus'> & {
    submitted_from: Pick<DatabaseRow<'locations'>, 'name'> | null
    submitted_by: Pick<DatabaseRow<'profiles'>, 'name' | 'email'> | null
  }

  export let skus: IncorrectSku[]
  export let errorMessage: string | undefined
  export let onDelete: (sku: IncorrectSku) => void
</script>

<div class="styled-table">
  <table>
    <thead>
      <tr>
        <th />
        <th>Incorrect Item Name</th>
        <th>Correct Item Name</th>
        <th>SKU</th>
        <th>Submitted From</th>
        <th>Submitted By</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      {#each skus as sku (sku.id)}
        {@const submitted_from = sku.submitted_from
          ? sku.submitted_from.name
          : null}
        {@const submitted_by = sku.submitted_by
          ? `${sku.submitted_by.name || sku.submitted_by_name || 'no name'} (${
              sku.submitted_by.email
            })`
          : sku.submitted_by_name || null}
        <tr>
          <td>
            <div class="flex justify-center gap-2">
              <form
                method="post"
                action="?/update&sku_id={sku.id}&fixed={!sku.fixed}"
                class="contents"
                use:enhance={async () => {
                  return async ({ result: { type }, update }) => {
                    await update()
                    if (type === 'success' || type === 'redirect') {
                      toast.success(
                        `SKU has been marked as ${
                          sku.fixed ? 'not fixed' : 'fixed'
                        }`,
                        {
                          duration: 3000
                        }
                      )
                    } else if (errorMessage) {
                      toast.error(errorMessage, { duration: 3000 })
                    }
                  }
                }}
              >
                <button
                  type="submit"
                  class="btn btn-icon {sku.fixed
                    ? 'btn-secondary'
                    : 'btn-primary'}"
                  title="Mark this SKU as {sku.fixed ? 'not fixed' : 'fixed'}"
                  ><Icon
                    src={sku.fixed ? XCircle : CheckCircle}
                    size="1.5rem"
                    solid
                  /></button
                >
              </form>
              <button
                type="button"
                class="btn btn-icon btn-danger"
                title="Delete this record"
                on:click={() => onDelete(sku)}
                ><Icon
                  src={Trash}
                  size="1.5rem"
                  solid
                /></button
              >
            </div>
          </td>
          <td>{sku.incorrect_item_name}</td>
          <td>{sku.correct_item_name}</td>
          <td>{sku.sku}</td>
          <td class:text-surface-500={!submitted_from}
            >{submitted_from ?? 'location was removed'}</td
          >
          <td class:text-surface-500={!submitted_by}
            >{submitted_by ?? 'not entered'}</td
          >
          <td class:text-surface-500={!sku.notes}>{sku.notes || 'none'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
