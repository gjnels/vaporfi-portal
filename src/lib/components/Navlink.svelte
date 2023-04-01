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
    'rounded-t-md border-b-2 border-transparent px-2 py-1 outline-none transition hover:bg-gray-800 hover:text-gray-100 focus-visible:bg-gray-800 focus-visible:text-gray-100',
    active ? 'border-gray-300' : 'text-gray-400/80'
  )}>{label}</a
>
