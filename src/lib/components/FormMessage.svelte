<script lang="ts">
  export let message: Message | undefined
</script>

{#if message}
  <span
    class:success={message.type === 'success'}
    class:error={message.type === 'error'}>{message}</span
  >
{/if}
