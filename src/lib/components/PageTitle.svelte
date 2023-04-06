<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let title: string
  export let styles = ''
</script>

<h1 class={twMerge('text-4xl font-semibold text-zinc-100', styles)}>
  {title}
</h1>
