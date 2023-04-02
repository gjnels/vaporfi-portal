<script lang="ts">
  import { Toaster } from 'svelte-french-toast'
  import { Logo, Navlink } from '../lib/components'
  import '../tailwind.css'
</script>

<svelte:head>
  <title>VaporFi Columbus</title>
</svelte:head>

<div class="flex h-full flex-col">
  <header class="border-b border-zinc-700">
    <div class="flex items-center px-4 py-1 md:px-6">
      <Logo />
    </div>
    <nav class="-mb-px flex gap-4 overflow-x-scroll px-4 md:px-6">
      <Navlink
        href="/"
        label="Promotions"
      />
      <Navlink
        href="/flavor-picker"
        label="Flavor Picker"
      />
    </nav>
  </header>

  <main class="grow">
    <slot />
  </main>

  <footer class="border-t border-zinc-700 p-2 text-center text-xs font-light">
    Created by Garrett Nelson &copy;2023
  </footer>
</div>

<Toaster />
