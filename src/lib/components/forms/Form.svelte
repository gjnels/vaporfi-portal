<script lang="ts">
  import type { SubmitFunction } from '$app/forms'
  import type { EnhancedForm } from 'sveltekit-superforms/client'
  import { twMerge } from 'tailwind-merge'
  import type { AnyZodObject, z } from 'zod'

  type T = $$Generic<AnyZodObject>
  type P = $$Generic<keyof z.infer<T>>

  export let method: 'post' | 'get' = 'post'
  export let action: string | undefined = undefined
  export let formError = ''
  export let enhance:
    | EnhancedForm<T, P>['enhance']
    | ((form: HTMLFormElement, submit?: SubmitFunction) => { destroy(): void })

  export let styles = ''
  export let actionSlotStyles = ''
  export let linkSlotStyles = ''
</script>

<form
  {method}
  {action}
  class={twMerge('flex flex-col gap-4', styles)}
  use:enhance
>
  <!-- form inputs -->
  <slot />

  <!-- overall form error -->
  {#if formError}
    <span class="self-center text-lg font-semibold text-rose-400"
      >{formError}</span
    >
  {/if}

  <!-- form actions (i.e. buttons) -->
  {#if $$slots.actions}
    <div
      class={twMerge(
        'flex flex-wrap gap-2 [&>*]:flex-1',
        !formError && 'mt-4',
        actionSlotStyles
      )}
    >
      <slot name="actions" />
    </div>
  {/if}

  <!-- links (i.e. "forgot you password?") -->
  {#if $$slots.links}
    <div
      class={twMerge('mt-4 flex flex-col items-center gap-2', linkSlotStyles)}
    >
      <slot name="links" />
    </div>
  {/if}
</form>
