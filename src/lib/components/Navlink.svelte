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
    active ? 'text-zinc-100' : 'text-zinc-500'
  )}
  ><span
    class={twMerge(
      'rounded-md px-3 py-1 transition group-hover:bg-zinc-800 group-hover:text-zinc-100 group-focus-visible:bg-zinc-800 group-focus-visible:text-zinc-100'
    )}>{label}</span
  >
  <div
    class={twMerge(
      'mx-2 h-0.5 rounded-full transition',
      active && 'bg-zinc-100'
    )}
  /></a
>
