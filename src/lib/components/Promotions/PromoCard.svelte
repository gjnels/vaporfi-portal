<script lang="ts">
  import { page } from '$app/stores'
  import type { Promo } from '$lib/types/promos.types'
  import { formatPromoDate } from '$lib/utils/dates'
  import { createDisplayBlendString } from '$lib/utils/flavors'

  export let promo: Promo

  $: isAdmin = $page.data.currentProfile?.role === 'Admin'
</script>

<svelte:element
  this={isAdmin ? 'a' : 'div'}
  href={isAdmin ? `/promotions/edit?promo_id=${promo.id}` : null}
  title={isAdmin ? `Edit ${promo.title} promotion` : null}
  class="card text-sm !font-medium border-token border-surface-300-600-token md:text-base"
  class:card-hover={isAdmin}
>
  <!--  title -->
  <h2 class="border-b p-4 text-primary-600 border-surface-300-600-token dark:text-primary-500">
    {promo.title}
  </h2>

  <div class="space-y-4 p-4">
    <!-- subitle -->
    {#if promo.subtitle}
      <h3 class="text-secondary-500-400-token">
        {promo.subtitle}
      </h3>
    {/if}

    <!-- custom blend -->
    {#if promo.blend}
      <div class="flex flex-wrap items-center gap-x-4 text-secondary-500-400-token">
        <h3 class="">{promo.blend.name}</h3>
        <span class="text-base font-heading-token md:text-lg"
          >{createDisplayBlendString(promo.blend)}</span
        >
      </div>
    {/if}

    <hr />

    <!-- details -->
    {#if promo.details}
      <p class="unstyled whitespace-pre-line">
        {promo.details}
      </p>
      <hr />
    {/if}

    <!-- promo active date range -->
    <div class="flex flex-wrap gap-x-8 gap-y-2">
      <!-- date promo begins (inclusive) -->
      <p class="unstyled flex flex-col">
        <span class="underline decoration-surface-400">Begins</span>
        <span class="font-medium">{formatPromoDate(promo.valid_from)}</span>
      </p>

      <!-- date promo ends (inclusive) -->
      <p class="unstyled flex flex-col">
        <span class="underline decoration-surface-400">Ends</span>
        <span class="font-medium">{formatPromoDate(promo.valid_until)}</span>
      </p>
    </div>
    <hr />

    <!-- sale -->
    <p class="unstyled flex flex-col">
      <span class="underline decoration-surface-400">Sale</span>
      <span class="whitespace-pre-line">{promo.sale}</span>
    </p>
  </div>

  <!-- notes -->
  {#if promo.notes}
    <p
      class="unstyled brightness-80 whitespace-pre-line border-t p-4 font-normal border-surface-300-600-token"
    >
      {promo.notes}
    </p>
  {/if}
</svelte:element>

<style lang="postcss">
  hr {
    @apply brightness-75;
  }
</style>
