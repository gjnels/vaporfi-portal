<script lang="ts">
  import { PageLayout } from '$components'

  export let data
</script>

<PageLayout>
  <h1 slot="header">My Profile</h1>
  <pre>{JSON.stringify(data.currentProfile, null, 2)}</pre>
</PageLayout>
