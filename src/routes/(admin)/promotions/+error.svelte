<script lang="ts">
  import { page } from '$app/stores'
  import { ExclamationTriangle, Icon } from 'svelte-hero-icons'
</script>

<svelte:head>
  <title>An error has occured | VF Columbus</title>
</svelte:head>

<div class="mt-10 flex flex-col items-center gap-2">
  <div class="mb-4 flex items-center gap-2 text-error-500">
    <Icon
      src={ExclamationTriangle}
      size="4rem"
    />
    <h2>{$page.error?.message}</h2>
  </div>
  {#if !$page.url.pathname.endsWith('promotions')}
    <a href="/promotions">Return to Promotions Manager</a>
  {:else}
    <a href="/">Return to Home Page</a>
  {/if}
</div>
