<script lang="ts">
  import { Icon, type IconSource } from 'svelte-hero-icons'
  import { twMerge } from 'tailwind-merge'

  export let href: string
  export let label: string
  export let iconSource: IconSource
  export let iconSize = '1em'
  // Extra classes to add to anchor
  export let classes = ''
</script>

<a
  {href}
  class={twMerge('inline-flex items-center gap-1', classes)}
>
  <Icon
    src={iconSource}
    size={iconSize}
  />
  <span>{label}</span>
</a>
