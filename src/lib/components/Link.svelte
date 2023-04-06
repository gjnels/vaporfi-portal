<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let href: string
  export let styles = ''
  export let color: 'green' | 'purple' | 'red' | 'gray' = 'green'
  export let colorOnHover = false
  export let showBorder: 'always' | 'hover' | 'never' = 'hover'
</script>

<a
  {href}
  class={twMerge(
    'rounded-md px-1 font-medium underline-offset-2 transition focus-visible:outline focus-visible:outline-zinc-100',
    showBorder === 'always' && 'underline',
    showBorder === 'hover' && 'hover:underline focus-visible:underline',
    color === 'green' && [
      'hover:text-green-400 focus-visible:text-green-400',
      !colorOnHover && 'text-green-500'
    ],
    color === 'purple' && [
      'hover:text-violet-400 focus-visible:text-violet-400',
      !colorOnHover && 'text-violet-500'
    ],
    color === 'red' && [
      'hover:text-rose-400 focus-visible:text-rose-400',
      !colorOnHover && 'text-rose-500'
    ],
    color === 'gray' && [
      'hover:text-zinc-300 focus-visible:text-zinc-300',
      !colorOnHover && 'text-zinc-400'
    ],
    styles
  )}><slot /></a
>
