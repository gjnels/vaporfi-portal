<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { twMerge } from 'tailwind-merge'

  export let type: HTMLButtonAttributes['type'] = 'button'
  export let disabled = false
  export let onclick: () => void = () => undefined
  export let use: (node: HTMLElement) => {
    destroy: () => void
  } = () => ({ destroy: () => undefined })
  export let color: 'green' | 'purple' | 'red' | 'gray' | undefined = undefined
  export let small = false
  export let icon = false
  export let transparent = false
  export let styles = ''
</script>

<button
  {type}
  {disabled}
  use:use
  on:click={onclick}
  class={twMerge(
    'flex items-center justify-center gap-1 rounded-lg border-2 border-transparent bg-transparent px-3 py-2 font-semibold text-surface-100 outline-none ring-surface-100 transition focus-visible:ring-2 active:scale-95',
    transparent
      ? ['hover:bg-surface-800', color && 'hover:text-surface-950']
      : 'hover:border-current hover:bg-transparent',
    color === 'green' && [
      icon
        ? 'text-primary-500 hover:text-primary-400'
        : transparent
        ? 'text-primary-500 hover:bg-primary-500'
        : 'bg-primary-600 hover:text-primary-500'
    ],
    color === 'purple' && [
      icon
        ? 'text-secondary-500 hover:text-secondary-400'
        : transparent
        ? 'text-secondary-500 hover:bg-secondary-500'
        : 'bg-secondary-600 hover:text-secondary-500'
    ],
    color === 'red' && [
      icon
        ? 'text-danger-500 hover:text-danger-500'
        : transparent
        ? 'text-danger-500 hover:bg-danger-500'
        : 'bg-danger-600 hover:text-danger-500'
    ],
    color === 'gray' && [
      icon
        ? 'text-surface-400 hover:text-surface-300'
        : transparent
        ? 'text-surface-400 hover:bg-surface-400'
        : 'bg-surface-500 hover:text-surface-300'
    ],
    small && 'px-2 py-1 text-sm',
    icon && 'p-1',
    styles
  )}
  {...$$restProps}
>
  <slot />
</button>
