<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms/index'
  import { twMerge } from 'tailwind-merge'

  import type { Color } from '.'
  import Errors from './Errors.svelte'
  import Label from './Label.svelte'

  type Value = $$Generic

  export let name: string
  export let value: Value
  export let groups: string[] | undefined = undefined
  export let options: { value: Value; label: string; group?: string }[]
  export let defaultOption: { value: Value; label: string } | undefined =
    undefined
  export let constraints: InputConstraint | undefined = undefined
  export let errors: string | string[] | undefined = undefined

  export let label = ''
  export let containerStyles = ''
  export let selectStyles = ''
  export let labelStyles = ''
  export let color: Color = undefined
</script>

<label class={twMerge('group flex flex-col gap-0.5', containerStyles)}>
  {#if label}
    <Label
      {label}
      styles={labelStyles}
      hasError={!!errors && !!errors.length}
    />
  {/if}

  <select
    {name}
    class={twMerge(
      'cursor-pointer rounded-lg border-2 border-transparent bg-zinc-800 px-3 py-2 text-zinc-100 outline-none transition focus:border-zinc-100 focus:bg-zinc-900 focus:ring-0',
      color === 'green' && 'focus:border-green-500',
      color === 'purple' && 'focus:border-violet-500',
      !!errors && !!errors.length && 'focus:border-rose-500',
      defaultOption && value === defaultOption.value && 'text-zinc-400',
      selectStyles
    )}
    bind:value
    data-invalid={errors}
    {...constraints}
  >
    {#if defaultOption}
      <option value={defaultOption.value}>{defaultOption.label}</option>
    {/if}
    {#if groups && groups.length > 0}
      {#each groups as group}
        <optgroup label={group}>
          {#each options.filter((option) => option.group === group) as { value, label }}
            <option {value}>{label}</option>
          {/each}
        </optgroup>
      {/each}
    {:else}
      {#each options as { value, label }}
        <option {value}>{label}</option>
      {/each}
    {/if}
  </select>

  <Errors {errors} />
</label>
