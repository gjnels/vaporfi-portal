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
    'rounded-md px-1 font-medium underline-offset-2 transition focus-visible:outline focus-visible:outline-surface-100',
    showBorder === 'always' && 'underline',
    showBorder === 'hover' && 'hover:underline focus-visible:underline',
    color === 'green' && [
      'hover:text-primary-400 focus-visible:text-primary-400',
      !colorOnHover && 'text-primary-500'
    ],
    color === 'purple' && [
      'hover:text-secondary-400 focus-visible:text-secondary-400',
      !colorOnHover && 'text-secondary-500'
    ],
    color === 'red' && [
      'hover:text-danger-400 focus-visible:text-danger-400',
      !colorOnHover && 'text-danger-500'
    ],
    color === 'gray' && [
      'hover:text-surface-300 focus-visible:text-surface-300',
      !colorOnHover && 'text-surface-400'
    ],
    styles
  )}><slot /></a
>
