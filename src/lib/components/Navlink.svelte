<script lang="ts">
  import { page } from '$app/stores'
  import { twMerge } from 'tailwind-merge'

  export let href: string
  export let label: string
  export let activePath = ''

  $: active = activePath
    ? $page.url.pathname.startsWith(activePath)
    : $page.url.pathname === href
</script>

<a
  {href}
  class={twMerge(
    'shrink-0 rounded-t-md border-b-2 border-transparent px-2 py-1 outline-none transition hover:bg-zinc-800 hover:text-green-400 focus-visible:bg-zinc-800 focus-visible:text-green-400',
    active ? 'border-zinc-300' : 'text-zinc-400/80'
  )}>{label}</a
>
