<script lang="ts">
  import { PageLayout, PageTitle } from '$lib/components'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ promos } = data)
</script>

<PageLayout>
  <PageTitle
    title="Promotions"
    slot="header"
  />

  {#if promos && promos.length > 0}
    <pre>{JSON.stringify(promos, null, 2)}</pre>
  {:else}
    <span class="text-center text-lg text-rose-500"
      >No current promotions found</span
    >
  {/if}
</PageLayout>
