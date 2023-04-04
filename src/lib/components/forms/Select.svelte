<script lang="ts">
  import { twMerge } from 'tailwind-merge'
  import type { Color } from '.'
  import Errors from './Errors.svelte'
  import Label from './Label.svelte'

  type Value = $$Generic

  export let label = ''
  export let name: string
  export let value: Value
  export let groups: string[] | undefined = undefined
  export let options: { value: Value; label: string; group?: string }[]
  export let defaultOption: { value: Value; label: string } | undefined =
    undefined
  export let errors: string | string[] | undefined = undefined

  export let containerStyles = ''
  export let selectStyles = ''
  export let labelStyles = ''
  export let color: Color = undefined
</script>

<label class={twMerge('group flex flex-col gap-0.5', containerStyles)}>
  {#if label}
    <Label
      {label}
      {color}
      styles={labelStyles}
      hasError={!!errors && !!errors.length}
    />
  {/if}

  <select
    {name}
    class={twMerge(
      'cursor-pointer rounded-lg border-[3px] border-transparent bg-zinc-800 px-3 py-2 text-white outline-none focus:border-zinc-300 focus:bg-transparent focus:ring-0',
      color === 'green' && 'focus:border-green-400',
      color === 'purple' && 'focus:border-violet-400',
      !!errors && !!errors.length && 'focus:border-rose-400',
      defaultOption && value === defaultOption.value && 'text-zinc-400',
      selectStyles
    )}
    bind:value
    {...$$restProps}
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
