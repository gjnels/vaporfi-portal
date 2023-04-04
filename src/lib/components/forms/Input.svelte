<script lang="ts">
  import type { HTMLInputTypeAttribute } from 'svelte/elements'
  import { twMerge } from 'tailwind-merge'
  import type { Color } from '.'
  import Errors from './Errors.svelte'
  import Label from './Label.svelte'

  type Value = $$Generic

  type InputType = Exclude<
    HTMLInputTypeAttribute,
    | 'button'
    | 'checkbox'
    | 'radio'
    | 'color'
    | 'file'
    | 'hidden'
    | 'image'
    | 'range'
    | 'reset'
    | 'submit'
  >

  export let type: InputType = 'text'
  export let value: Value
  export let errors: string | string[] | undefined = undefined
  export let name: string | undefined = undefined
  export let placeholder = ''
  export let label = ''
  export let disabled = false

  export let containerStyles = ''
  export let inputStyles = ''
  export let labelStyles = ''
  export let color: Color = undefined

  const setType = (el: HTMLInputElement) => {
    el.type = type
  }
</script>

<label class={twMerge('group flex flex-col', containerStyles)}>
  {#if label}
    <Label
      {label}
      {color}
      styles={labelStyles}
      hasError={!!errors && !!errors.length}
    />
  {/if}

  <input
    use:setType
    {placeholder}
    {name}
    class={twMerge(
      'rounded-lg border-[3px] border-transparent bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 outline-none focus:border-zinc-300 focus:bg-transparent focus:ring-0',
      color === 'green' && 'focus:border-green-400',
      color === 'purple' && 'focus:border-violet-400',
      !!errors && !!errors.length && 'focus:border-rose-400',
      inputStyles
    )}
    bind:value
    {disabled}
    {...$$restProps}
  />

  <Errors {errors} />
</label>
