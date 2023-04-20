<script lang="ts">
  export let message: Message | undefined
</script>

{#if message}
  {#if Array.isArray(message.message)}
    <div class="flex flex-col gap-2">
      {#each message.message as msg}
        <span
          class:form-success={message.type === 'success'}
          class:form-error={message.type === 'error'}>{msg}</span
        >
      {/each}
    </div>
  {:else}
    <span
      class:form-success={message.type === 'success'}
      class:form-error={message.type === 'error'}>{message.message}</span
    >
  {/if}
{/if}
