<script lang="ts">
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import PromoCard from '$components/Promotions/PromoCard.svelte'

  export let data
</script>

<svelte:head>
  <title>Active Promotions | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Active Promotions</h1>
  </svelte:fragment>

  {#if !data.promos || data.promos.length === 0}
    <p class="text-center text-lg text-error-500">No current promotions found</p>
  {:else}
    <div class="grid gap-8 xl:grid-cols-2">
      {#each data.promos as promo (promo.id)}
        <PromoCard {promo} />
      {/each}
    </div>
  {/if}
</PageLayout>
