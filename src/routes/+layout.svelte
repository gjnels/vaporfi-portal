<script lang="ts">
  import { Logo } from '../lib/components'
  import '../tailwind.css'
</script>

<svelte:head>
  <title>VaporFi Columbus</title>
</svelte:head>

<div class="flex h-full flex-col">
  <header class="flex h-12 items-center border-b border-slate-600 px-4 md:h-16">
    <Logo />
  </header>

  <main class="mx-auto w-full max-w-screen-2xl grow p-4">
    <slot />
  </main>

  <footer class="border-t border-slate-600 p-2 text-center text-xs font-light">
    Created by Garrett Nelson &copy;2023
  </footer>
</div>
