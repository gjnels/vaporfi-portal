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
      'peer cursor-pointer rounded-sm text-zinc-400 transition focus:ring-current focus:ring-offset-0  focus:checked:ring-zinc-100',
      color === 'green' && 'text-green-500',
      color === 'purple' && 'text-violet-500',
      checkboxStyles
    )}
    {required}
  />

  <span
    class={twMerge(
      'select-none text-zinc-400 transition group-focus-within:text-zinc-400 group-hover:text-zinc-400 peer-checked:text-zinc-100 group-focus-within:peer-checked:text-zinc-100 group-hover:peer-checked:text-zinc-400',
      color === 'green' &&
        'group-focus-within:text-green-600 group-hover:text-green-600 group-focus-within:peer-checked:text-green-400 group-hover:peer-checked:text-green-400',
      color === 'purple' &&
        'group-focus-within:text-violet-400/75 group-hover:text-violet-400/75 group-focus-within:peer-checked:text-violet-400 group-hover:peer-checked:text-violet-400',
      labelStyles
    )}>{label}</span
  >
</label>

<Errors {errors} />
