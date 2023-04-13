<script lang="ts">
  import dayjs from 'dayjs'
  import toast from 'svelte-french-toast'
  import { createDialog } from 'svelte-headlessui'
  import { superForm } from 'sveltekit-superforms/client'

  import { formatPromoTableDate } from '$lib/utils/dates.js'
  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  import { Modal, PageLayout } from '$components'

  export let data

  const deleteModal = createDialog()
  const { form, enhance, reset } = superForm(data.form, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      if (type === 'success') {
        deleteModal.close()
      } else if (type === 'failure') {
        toast.error(
          'There was a problem deleting this promotion. Try again later.'
        )
      }
    }
  })

  $: if (!$deleteModal.expanded) reset()
</script>

<svelte:head>
  <title>Manage Promotions | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Edit Promotions</h1>
    <a
      href="promotions/new"
      class="btn btn-primary btn-small ml-auto">Create New Promotion</a
    >
  </svelte:fragment>

  <div class="overflow-x-scroll rounded-xl">
    <table class="w-full rounded-lg">
      <thead class="bg-surface-600 text-left">
        <tr class="[&>*]:px-4 [&>*]:py-2">
          <th />
          <th>Title</th>
          <th>Subtitle</th>
          <th>Sale</th>
          <th>Custom Blend</th>
          <th>Starts</th>
          <th>Ends</th>
        </tr>
      </thead>
      <tbody class="bg-surface-800">
        {#each data.promos as promo (promo.id)}
          {@const now = dayjs()}
          {@const active =
            now.isAfter(promo.valid_from) && now.isBefore(promo.valid_until)}
          <tr
            class="whitespace-pre border-b border-surface-500 text-surface-50 last:border-none [&>*]:px-4 [&>*]:py-2"
            class:opacity-50={!active}
          >
            <td
              ><div class="grid gap-2">
                <a
                  href="promotions/edit?promo_id={promo.id}"
                  class="btn btn-secondary btn-small">Edit</a
                >
                <button
                  type="button"
                  class="btn btn-danger btn-small"
                  on:click={() => {
                    $form.id = promo.id
                    deleteModal.open()
                  }}>Delete</button
                >
              </div></td
            >
            <td class="text-xl font-semibold">{promo.title}</td>
            <td class="text-lg font-medium">{promo.subtitle ?? ''}</td>
            <td>{promo.sale}</td>
            <td>
              {#if promo.blend}
                <div class="grid">
                  <span class="text-lg font-medium">{promo.blend.name}</span>
                  <span>{createDisplayBlendString(promo.blend)}</span>
                </div>
              {/if}
            </td>
            <td class:text-warning-300={now.isBefore(promo.valid_from)}
              >{formatPromoTableDate(promo.valid_from)}</td
            >
            <td
              class:text-warning-300={now.isBefore(promo.valid_until) &&
                now.isSame(promo.valid_until, 'day')}
              class:text-danger-400={now.isAfter(promo.valid_until)}
              >{formatPromoTableDate(promo.valid_until)}</td
            >
          </tr>
        {/each}
      </tbody>
      <tfoot class="bg-surface-600 text-left">
        <tr class="[&>*]:px-4 [&>*]:py-2">
          <th />
          <th>Title</th>
          <th>Subtitle</th>
          <th>Sale</th>
          <th>Custom Blend</th>
          <th>Starts</th>
          <th>Ends</th>
        </tr>
      </tfoot>
    </table>
  </div>
</PageLayout>

<Modal modalStore={deleteModal}>
  <p>Are you sure you want to delete this promotion?</p>
  <p class="mt-2 text-center text-2xl font-bold">
    {data.promos.find((p) => p.id === $form.id)?.title}
  </p>
  <div class="mt-8 flex w-full justify-center gap-4">
    <form
      method="post"
      use:enhance
      action="?/deletePromo"
      class="flex-1"
    >
      <button
        type="submit"
        class="btn btn-danger btn-small w-full flex-1">Yes</button
      >
    </form>
    <button
      type="button"
      class="btn btn-small flex-1"
      on:click={deleteModal.close}>No</button
    >
  </div>
</Modal>
