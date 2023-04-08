<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  import type { Color } from '.'
  import Errors from './Errors.svelte'

  export let label: string
  export let name: string
  export let checked: boolean
  export let errors: string | string[] | undefined = undefined
  export let required = false

  export let color: Color = 'green'
  export let containerStyles = ''
  export let labelStyles = ''
  export let checkboxStyles = ''
</script>

<label
  class={twMerge(
    'group flex w-fit cursor-pointer items-center gap-1.5',
    containerStyles
  )}
>
  <input
    type="checkbox"
    {name}
    bind:checked
    class={twMerge(
      'peer cursor-pointer rounded-sm text-surface-400 transition focus:ring-current focus:ring-offset-0  focus:checked:ring-surface-100',
      color === 'green' && 'text-primary-500',
      color === 'purple' && 'text-secondary-500',
      checkboxStyles
    )}
    {required}
  />

  <span
    class={twMerge(
      'select-none text-surface-400 transition group-focus-within:text-surface-400 group-hover:text-surface-400 peer-checked:text-surface-100 group-focus-within:peer-checked:text-surface-100 group-hover:peer-checked:text-surface-400',
      color === 'green' &&
        'group-focus-within:text-primary-600 group-hover:text-primary-600 group-focus-within:peer-checked:text-primary-400 group-hover:peer-checked:text-primary-400',
      color === 'purple' &&
        'group-focus-within:text-secondary-400/75 group-hover:text-secondary-400/75 group-focus-within:peer-checked:text-secondary-400 group-hover:peer-checked:text-secondary-400',
      labelStyles
    )}>{label}</span
  >
</label>

<Errors {errors} />
