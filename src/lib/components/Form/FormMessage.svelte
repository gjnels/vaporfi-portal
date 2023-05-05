<script lang="ts">
  export let message: Message | undefined
</script>

{#if message}
  <div class="flex flex-col items-center gap-1">
    {#if Array.isArray(message.message)}
      {#each message.message as msg}
        <span
          class:form-success={message.type === 'success'}
          class:form-error={message.type === 'error'}>{msg}</span
        >
      {/each}
    {:else}
      <span
        class:form-success={message.type === 'success'}
        class:form-error={message.type === 'error'}>{message.message}</span
      >
    {/if}
  </div>
{/if}

<style lang="postcss">
  .form-success {
    @apply text-success-600 dark:text-success-500;
  }

  .form-error {
    @apply text-error-600 dark:text-error-500;
  }
</style>
