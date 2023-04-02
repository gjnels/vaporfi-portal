<script lang="ts">
  export let errors: string | string[] | undefined
</script>

{#if !!errors}
  {#if typeof errors === 'string'}
    <span class="ml-1 mt-1 font-medium leading-tight text-rose-400"
      >* {errors}</span
    >
  {:else}
    {#each errors as error}
      <span class="ml-1 mt-1 font-medium leading-tight text-rose-400"
        >* {error}</span
      >
    {/each}
  {/if}
{/if}
