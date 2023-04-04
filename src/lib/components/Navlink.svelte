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
    'group flex shrink-0 flex-col gap-1 outline-none transition',
    active ? 'text-white' : 'text-zinc-400/80'
  )}
  ><span
    class={twMerge(
      'rounded-md px-3 py-1 group-hover:bg-zinc-800 group-hover:text-white'
    )}>{label}</span
  >
  <div class={twMerge('mx-2 h-0.5 rounded-full', active && 'bg-white')} /></a
>
