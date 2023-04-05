<script lang="ts">
  import { page } from '$app/stores'

  import { PageLayout, PageTitle } from '$components'

  $: path = $page.url.pathname.split('/').slice(-1)[0]
</script>

<PageLayout headerContainerStyles="flex-col items-start gap-2">
  <svelte:fragment slot="header">
    {#if path === 'level'}
      <PageTitle title="Nicotine Level Calculator" />
      <span class="text-zinc-400"
        >Calculate the total number of packets needed to get to a specific
        nicotine level</span
      >
    {:else if path === 'packets'}
      <PageTitle title="Nicotine Packet Calculator" />
      <span class="text-zinc-400"
        >Calculate the final nicotine level based on the packets to add</span
      >
    {/if}
  </svelte:fragment>
  <slot />
</PageLayout>
