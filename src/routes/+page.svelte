<script lang="ts">
  import { PageLayout, PageTitle } from '$lib/components'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<PageLayout>
  <PageTitle
    title="Promotions"
    slot="header"
  />

  <span> promotions </span>
</PageLayout>
