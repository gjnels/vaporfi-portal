<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let label: string
  export let hasError: boolean
  export let styles: string
</script>

<span
  class={twMerge(
    'ml-1 transition group-focus-within:text-zinc-100',
    hasError &&
      'text-rose-500 selection:bg-rose-200 group-focus-within:text-rose-500',
    styles
  )}>{label}</span
>
