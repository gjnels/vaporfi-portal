<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { twMerge } from 'tailwind-merge'

  export let type: HTMLButtonAttributes['type'] = 'button'
  export let disabled = false
  export let onclick: () => void = () => undefined
  export let color: 'green' | 'purple' | 'red' | 'gray' | undefined = undefined
  export let variant: 'small' | 'icon' | undefined = undefined
  export let styles = ''
</script>

<button
  {type}
  {disabled}
  on:click={onclick}
  class={twMerge(
    'inline-flex items-center justify-center gap-1 rounded-lg border-2 border-transparent px-3 py-2 font-semibold text-white outline-none ring-white transition hover:border-current hover:bg-transparent focus-visible:ring',
    color === 'green' && 'bg-green-600 hover:text-green-500',
    color === 'purple' && 'bg-violet-600 hover:text-violet-500',
    color === 'red' && 'bg-rose-600 hover:text-rose-500',
    color === 'gray' && 'bg-zinc-600 hover:text-zinc-400',
    variant === 'small' && 'px-2 py-1 text-sm',
    variant == 'icon' && 'p-1',
    styles
  )}
  {...$$restProps}
>
  <slot />
</button>
