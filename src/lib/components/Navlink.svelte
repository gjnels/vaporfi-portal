<script lang="ts">
  import { page } from '$app/stores'
  import { twMerge } from 'tailwind-merge'

  export let href: string
  export let label: string

  $: active = $page.url.pathname === href
</script>

<a
  {href}
  class={twMerge(
    'rounded-t-md border-b-2 border-transparent px-2 py-1 outline-none transition hover:bg-zinc-800 hover:text-zinc-100 focus-visible:bg-zinc-800 focus-visible:text-zinc-100',
    active ? 'border-zinc-300' : 'text-zinc-400/80'
  )}>{label}</a
>
