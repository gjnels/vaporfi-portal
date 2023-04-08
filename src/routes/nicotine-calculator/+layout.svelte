<script lang="ts">
  import { page } from '$app/stores'

  import { PageLayout } from '$components'

  $: path = $page.url.pathname.split('/').slice(-1)[0]
</script>

<PageLayout headerContainerStyles="flex-col items-start gap-2">
  <svelte:fragment slot="header">
    {#if path === 'level'}
      <h1>Nicotine Level Calculator</h1>
      <span class="text-surface-400"
        >Calculate the total number of packets needed to get to a specific
        nicotine level</span
      >
    {:else if path === 'packets'}
      <h1>Nicotine Packet Calculator</h1>
      <span class="text-surface-400"
        >Calculate the final nicotine level based on the packets to add</span
      >
    {/if}
  </svelte:fragment>
  <slot />
</PageLayout>
