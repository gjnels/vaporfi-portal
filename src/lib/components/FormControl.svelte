<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let label: string
  export let errors: string | string[] | undefined
</script>

<label class="group flex flex-col gap-1">
  {#if label}
    <span
      class={twMerge(
        'text-sm transition',
        !!errors && !!errors.length && 'text-danger-500 selection:bg-danger-200'
      )}>{label}</span
    >
  {/if}

  <slot />

  {#if !!errors}
    {#if typeof errors === 'string'}
      <span
        class="ml-1 mt-1 font-medium leading-tight text-danger-500 selection:bg-danger-200"
        >* {errors}</span
      >
    {:else}
      {#each errors as error}
        <span
          class="ml-1 mt-1 font-medium leading-tight text-danger-500 selection:bg-danger-200"
          >* {error}</span
        >
      {/each}
    {/if}
  {/if}
</label>

<style lang="postcss">
  label:has(.radio-group) {
    @apply w-fit;
  }

  label:has(:disabled) {
    @apply opacity-50;
  }
</style>
