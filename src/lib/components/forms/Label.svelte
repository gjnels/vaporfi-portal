<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let label: string
  export let hasError: boolean
  export let styles: string
</script>

<span
  class={twMerge(
    'ml-1 transition group-focus-within:text-surface-100',
    hasError &&
      'text-danger-500 selection:bg-danger-200 group-focus-within:text-danger-500',
    styles
  )}>{label}</span
>
