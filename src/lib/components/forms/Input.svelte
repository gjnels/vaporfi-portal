<script lang="ts">
  import type { HTMLInputTypeAttribute } from 'svelte/elements'
  import type { InputConstraint } from 'sveltekit-superforms/index'
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
  export let name: string
  export let value: Value
  export let constraints: InputConstraint | undefined = undefined
  export let errors: string | string[] | undefined = undefined

  type Step = $$Generic<
    typeof type extends 'number' ? 'any' | number | undefined : undefined
  >
  export let step: Step = undefined as Step

  export let label = ''
  export let containerStyles = ''
  export let inputStyles = ''
  export let labelStyles = ''
  export let color: Color = undefined

  const inputClasses = twMerge(
    'rounded-lg border-2 border-transparent bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 outline-none transition focus:border-white focus:bg-zinc-900 focus:ring-0',
    color === 'green' && 'focus:border-green-500',
    color === 'purple' && 'focus:border-violet-500',
    !!errors && !!errors.length && 'focus:border-rose-500',
    inputStyles
  )

  const setType = (el: HTMLInputElement) => {
    el.type = type
  }
</script>

<label class={twMerge('group flex flex-col', containerStyles)}>
  {#if label}
    <Label
      {label}
      styles={labelStyles}
      hasError={!!errors && !!errors.length}
    />
  {/if}

  {#if type === 'number'}
    <input
      type="number"
      {name}
      bind:value
      data-invalid={errors}
      class={inputClasses}
      {...constraints}
      {step}
    />
  {:else}
    <input
      use:setType
      {name}
      bind:value
      data-invalid={errors}
      class={inputClasses}
      {...constraints}
    />
  {/if}

  <Errors {errors} />
</label>
