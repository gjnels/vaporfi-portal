<script lang="ts">
  export let label = ''
  export let errors: string | string[] | undefined
</script>

<label class="label">
  {#if label}
    <span>{label}</span>
  {/if}

  <slot />

  {#if errors}
    <div class="flex flex-col">
      {#if Array.isArray(errors)}
        {#each errors as error}
          <span class="text-error-500 selection:bg-error-200">* {error}</span>
        {/each}
      {:else}
        <span class="text-error-500 selection:bg-error-200">* {errors}</span>
      {/if}
    </div>
  {/if}
</label>

<style lang="postcss">
  label:has(input[type='radio']),
  label:has(input[type='checkbox']) {
    @apply w-fit;
  }
</style>
