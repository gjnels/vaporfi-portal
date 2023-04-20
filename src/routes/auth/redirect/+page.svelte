<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'

  import { PageLayout } from '$components'

  export let data

  $: if (browser && data.session) {
    goto(data.redirectTo, { replaceState: true })
  }
</script>

<svelte:head>
  <title>Confirming your account | VF Columbus</title>
</svelte:head>

<PageLayout>
  <p class="animate-pulse text-center text-2xl text-primary-400">
    Confirming your account...
  </p>
</PageLayout>
