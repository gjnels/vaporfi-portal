<script lang="ts">
  import dayjs from 'dayjs'
  import { formatPromoTableDate } from '$lib/utils/dates.js'
  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  import { Icon, PencilSquare } from 'svelte-hero-icons'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'

  export let data
</script>

<svelte:head>
  <title>Manage Promotions | VF Columbus</title>
</svelte:head>

<PageLayout headerWrapperStyles="space-y-4">
  <svelte:fragment slot="header">
    <h1>Manage Promotions</h1>
    <a
      href="/promotions/new"
      class="btn btn-sm variant-soft-primary hover:variant-filled-primary">Create New Promotion</a
    >
  </svelte:fragment>

  <div class="table-container">
    <table class="table-hover table">
      <thead>
        <tr>
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
          {@const active = now.isAfter(promo.valid_from) && now.isBefore(promo.valid_until)}
          <tr class:brightness-50={!active}>
            <td>
              <a
                href="/promotions/edit?promo_id={promo.id}"
                title="Edit this promotion"
                class="btn-icon btn-icon-sm variant-soft-secondary hover:variant-filled-secondary"
              >
                <Icon
                  src={PencilSquare}
                  size="1.5em"
                  solid
                />
              </a></td
            >
            <td><h3>{promo.title}</h3></td>
            <td class:brightness-50={!promo.subtitle}>{promo.subtitle || 'none'}</td>
            <td class="!whitespace-pre">{promo.sale}</td>
            <td class:brightness-50={!promo.blend}>
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
