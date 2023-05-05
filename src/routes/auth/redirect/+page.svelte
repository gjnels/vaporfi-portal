<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'

  import PageLayout from '$components/PageLayout/PageLayout.svelte'

  export let data

  $: if (browser && data.session) {
    goto(data.redirectTo, { replaceState: true })
  }
</script>

<svelte:head>
  <title>Confirming your account | VF Columbus</title>
</svelte:head>

<PageLayout>
  <h2 class="animate-pulse text-center text-tertiary-600 dark:text-tertiary-500">
    Confirming your account...
  </h2>
</PageLayout>
