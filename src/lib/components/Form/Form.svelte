<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  import type { SuperForm } from 'sveltekit-superforms/client'
  import type { ZodValidation } from 'sveltekit-superforms'
  import type { AnyZodObject } from 'zod'

  import FormMessage from './FormMessage.svelte'

  export let method: 'post' | 'get' = 'post'
  export let action: string | undefined = undefined

  type Schema = $$Generic<ZodValidation<AnyZodObject>>

  export let superForm: SuperForm<Schema, Message>
  $: ({ enhance, message } = superForm)

  export let baseClass = ''
  export let slotDefaultClass = ''
  export let slotActionsClass = ''
</script>

<form
  {method}
  {action}
  use:enhance
  class="card h-fit overflow-hidden bg-surface-50-900-token border-token border-surface-300-600-token {baseClass}"
>
  <!-- Form controls -->
  <div class={twMerge('flex flex-col gap-6 p-6', slotDefaultClass)}>
    <slot />
    <!-- Form error or success messages -->
    <FormMessage message={$message} />
  </div>

  <!-- Form actions (buttons) -->
  {#if $$slots.actions}
    <div
      class="flex flex-wrap justify-end gap-3 !border-x-0 !border-b-0 px-6 py-3 bg-surface-100-800-token border-token border-surface-300-600-token {slotActionsClass}"
    >
      <slot name="actions" />
    </div>
  {/if}
</form>
