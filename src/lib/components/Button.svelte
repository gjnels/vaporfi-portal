<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { twMerge } from 'tailwind-merge'

  export let type: HTMLButtonAttributes['type'] = 'button'
  export let disabled = false
  export let onclick: () => void = () => undefined
  export let color: 'green' | 'purple' | 'red' | 'gray' | undefined = undefined
  export let small = false
  export let icon = false
  export let transparent = false
  export let styles = ''
</script>

<button
  {type}
  {disabled}
  on:click={onclick}
  class={twMerge(
    'inline-flex items-center justify-center gap-1 rounded-lg border-2 border-transparent bg-transparent px-3 py-2 font-semibold text-white outline-none ring-white transition hover:border-current hover:bg-transparent focus-visible:ring active:scale-95',
    color === 'green' && [
      icon
        ? 'text-green-500 hover:text-green-400'
        : 'bg-green-600 hover:text-green-500'
    ],
    color === 'purple' && [
      icon
        ? 'text-violet-500 hover:text-violet-400'
        : 'bg-violet-600 hover:text-violet-500'
    ],
    color === 'red' && [
      icon
        ? 'text-rose-500 hover:text-rose-500'
        : 'bg-rose-600 hover:text-rose-500'
    ],
    color === 'gray' && [
      icon
        ? 'text-zinc-400 hover:text-zinc-300'
        : 'bg-zinc-500 hover:text-zinc-300'
    ],
    small && 'px-2 py-1 text-sm',
    icon && 'h-8 w-8 p-1',
    styles
  )}
  {...$$restProps}
>
  <slot />
</button>
