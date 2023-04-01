<script lang="ts">
  import { PageLayout, PageTitle } from '$lib/components'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<PageLayout>
  <PageTitle
    title="Flavor Picker"
    slot="header"
  />
  <pre>{JSON.stringify(data.flavors, null, 2)}</pre>
</PageLayout>
