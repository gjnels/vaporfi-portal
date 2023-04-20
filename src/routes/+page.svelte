<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  import { formatPromoDate } from '$lib/utils/dates'
  import { createDisplayBlendString } from '$lib/utils/flavors'

  import { Divider, PageLayout } from '$components'

  export let data
  $: promos = data.promos
</script>

<svelte:head>
  <title>Active Promotions | VF Columbus</title>
</svelte:head>

<PageLayout>
  <h1 slot="header">Active Promotions</h1>

  {#if !promos || promos.length === 0}
    <p class="text-center text-lg text-danger-500">
      No current promotions found
    </p>
  {:else}
    {@const isAdmin = data.currentProfile?.role === 'Admin'}
    <div class="grid gap-8 md:grid-cols-2">
      {#each promos as promo (promo.id)}
        <svelte:element
          this={isAdmin ? 'a' : 'div'}
          href={isAdmin ? `/promotions/edit?promo_id=${promo.id}` : null}
          title={isAdmin ? `Edit ${promo.title} promotion` : null}
          class={twMerge(
            'flex flex-col gap-4 rounded-lg border border-transparent bg-surface-700/50 p-4 shadow',
            isAdmin && 'transition hover:border-primary hover:bg-surface-950'
          )}
        >
          <!--  title -->
          <h2 class="text-3xl font-semibold text-primary">
            {promo.title}
          </h2>

          <!-- subitle -->
          {#if promo.subtitle}
            <h3 class="-mt-2 px-2 text-2xl font-medium text-primary-200">
              {promo.subtitle}
            </h3>
          {/if}

          <!-- custom blend -->
          {#if promo.blend}
            <p class="-mt-2 flex flex-wrap items-center gap-x-4 px-2">
              <span class="text-xl text-primary-200">{promo.blend.name}</span>
              <span class="text-secondary-200"
                >{createDisplayBlendString(promo.blend)}</span
              >
            </p>
          {/if}

          <Divider />

          <!-- details -->
          {#if promo.details}
            <p class="whitespace-pre-line px-2">
              {promo.details}
            </p>
            <Divider />
          {/if}

          <!-- date promo begins (inclusive) -->
          <div class="flex flex-wrap gap-x-8 gap-y-2 px-2">
            <p class="flex flex-col">
              <span class="text-lg underline decoration-surface-400"
                >Begins</span
              >
              <span class="font-medium"
                >{formatPromoDate(promo.valid_from)}</span
              >
            </p>
            <!-- date promo ends (inclusive) -->
            <p class="flex flex-col">
              <span class="text-lg underline decoration-surface-400">Ends</span>
              <span class="font-medium"
                >{formatPromoDate(promo.valid_until)}</span
              >
            </p>
          </div>

          <Divider />

          <!-- sale -->
          <p class="flex flex-col px-2">
            <span class="text-lg underline decoration-surface-400">Sale</span>
            <span class="whitespace-pre-line">{promo.sale}</span>
          </p>

          <!-- notes -->
          {#if promo.notes}
            <Divider />
            <span class="whitespace-pre-line px-2 text-surface-300">
              {promo.notes}
            </span>
          {/if}
        </svelte:element>
      {/each}
    </div>
  {/if}
</PageLayout>
