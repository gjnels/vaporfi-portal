<script lang="ts">
  import { Toaster } from 'svelte-french-toast'
  import { Logo, Navlink } from '../lib/components'
  import '../tailwind.css'
</script>

<div class="flex min-h-full flex-col">
  <header class="flex items-center px-4 py-1 md:px-6">
    <Logo />
  </header>
  <nav
    class="sticky top-0 flex gap-4 overflow-x-scroll border-b border-zinc-700 bg-black px-4 pt-2 shadow-md md:px-6"
  >
    <Navlink
      href="/"
      label="Promotions"
    />
    <Navlink
      href="/flavor-picker"
      label="Flavor Picker"
    />
    <Navlink
      href="/nicotine-calculator/packets"
      label="Nicotine Calculator"
      activePath="/nicotine-calculator"
    />
  </nav>

  <main class="flex grow flex-col">
    <slot />
  </main>

  <footer class="border-t border-zinc-700 p-2 text-center text-xs font-light">
    Created by Garrett Nelson &copy;2023
  </footer>
</div>

<Toaster />
