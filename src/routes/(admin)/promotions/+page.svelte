<script lang="ts">
  import dayjs from 'dayjs'
  import { Icon, PencilSquare } from 'svelte-hero-icons'

  import { formatPromoTableDate } from '$lib/utils/dates.js'
  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  import { PageLayout } from '$components'

  export let data
</script>

<svelte:head>
  <title>Manage Promotions | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Manage Promotions</h1>
    <a
      href="/promotions/new"
      class="btn btn-primary btn-small">Create New Promotion</a
    >
  </svelte:fragment>

  <div class="overflow-auto rounded-lg">
    <table class="w-full">
      <thead class="bg-surface-700 text-left">
        <tr class="[&>*]:p-4">
          <th />
          <th>Title</th>
          <th>Subtitle</th>
          <th>Sale</th>
          <th>Custom Blend</th>
          <th>Starts</th>
          <th>Ends</th>
        </tr>
      </thead>
      <tbody>
        {#each data.promos as promo (promo.id)}
          {@const now = dayjs()}
          {@const active =
            now.isAfter(promo.valid_from) && now.isBefore(promo.valid_until)}
          <tr
            class="whitespace-pre border-b border-surface-700 bg-surface-800 transition last:border-none hover:bg-surface-950 [&>*]:p-4"
            class:opacity-50={!active}
          >
            <td>
              <a
                href="/promotions/edit?promo_id={promo.id}"
                title="Edit this promotion"
                class="btn btn-secondary btn-icon"
              >
                <Icon
                  src={PencilSquare}
                  size="1.5rem"
                  solid
                />
              </a></td
            >
            <td class="text-xl font-semibold">{promo.title}</td>
            <td class:text-surface-500={!promo.subtitle}
              >{promo.subtitle ?? 'none'}</td
            >
            <td>{promo.sale}</td>
            <td class:text-surface-500={!promo.blend}>
              {#if promo.blend}
                <div class="grid">
                  <span class="text-lg font-medium">{promo.blend.name}</span>
                  <span>{createDisplayBlendString(promo.blend)}</span>
                </div>
              {:else}
                none
              {/if}
            </td>
            <td class:text-warning-300={now.isSame(promo.valid_until, 'day')}
              >{formatPromoTableDate(promo.valid_from)}</td
            >
            <td class:text-warning-300={now.isSame(promo.valid_until, 'day')}
              >{formatPromoTableDate(promo.valid_until)}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</PageLayout>
