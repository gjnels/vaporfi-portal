<script lang="ts">
  import { Logo, Navlink } from '../lib/components'
  import '../tailwind.css'
</script>

<svelte:head>
  <title>VaporFi Columbus</title>
</svelte:head>

<div class="flex h-full flex-col">
  <header class="border-b-2 border-gray-800 px-4 md:px-6">
    <div class="flex items-center py-1">
      <Logo />
    </div>
    <nav class="-mb-0.5 flex gap-4 overflow-x-scroll">
      <Navlink
        href="/"
        label="Promotions"
      />
    </nav>
  </header>

  <main class="grow">
    <slot />
  </main>

  <footer class="border-t border-gray-800 p-2 text-center text-xs font-light">
    Created by Garrett Nelson &copy;2023
  </footer>
</div>
