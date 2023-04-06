<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms/index'
  import { twMerge } from 'tailwind-merge'

  import type { Color } from '.'
  import Errors from './Errors.svelte'

  type Value = $$Generic

  export let name: string
  export let group: Value
  export let options: { value: Value; label: string }[]
  export let constraints: InputConstraint | undefined = undefined
  export let errors: string | string[] | undefined = undefined

  export let label = ''
  export let color: Color = 'green'
  export let horizontal = false
  export let containerStyles = ''
  export let labelStyles = ''
  export let radioStyles = ''
  export let radioLabelStyles = ''
  export let radioContainerStyles = ''
</script>

<div class={twMerge('flex flex-col', containerStyles)}>
  {#if label}
    <span
      class={twMerge(
        !!errors && !!errors.length && 'text-red-400',
        labelStyles
      )}>{label}</span
    >
  {/if}

  <div
    class={twMerge(
      'flex gap-x-6 gap-y-1',
      horizontal ? 'flex-wrap' : 'flex-col',
      radioContainerStyles
    )}
  >
    {#each options as option}
      <label
        class={twMerge(
          'group flex w-fit cursor-pointer items-center gap-1',
          radioLabelStyles
        )}
      >
        <input
          type="radio"
          {name}
          bind:group
          value={option.value}
          class={twMerge(
            'peer cursor-pointer text-zinc-400 transition focus:ring-zinc-100 focus:ring-offset-0',
            color === 'green' && 'text-green-500',
            color === 'purple' && 'text-violet-500',
            radioStyles
          )}
          {...constraints}
        />

        <span
          class={twMerge(
            'select-none transition group-focus-within:text-zinc-400 group-hover:text-zinc-400 peer-checked:text-zinc-100',
            color === 'green' &&
              'group-focus-within:text-green-400 group-hover:text-green-400',
            color === 'purple' &&
              'group-focus-within:text-violet-400 group-hover:text-violet-400',
            labelStyles
          )}>{option.label}</span
        >
      </label>
    {/each}
  </div>

  <Errors {errors} />
</div>
