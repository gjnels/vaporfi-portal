<script lang="ts">
  import { createDisplayBlendString } from '$lib/utils/flavors.js'

  import { PageLayout } from '$components'

  export let data
</script>

<svelte:head>
  <title>Custom Blends | VF Columbus</title>
</svelte:head>

<PageLayout>
  <h1 slot="header">Custom Blends</h1>

  {#if data.blends.length === 0}
    <p class="italic text-danger-500">No custom blends found</p>
  {:else}
    <ul>
      {#each data.blends as blend (blend.id)}
        <li>
          <span>{blend.name}</span>
          <span>{createDisplayBlendString(blend)}</span>
        </li>
      {/each}
    </ul>
  {/if}
</PageLayout>
