<script lang="ts">
  import { page } from '$app/stores'
  import { Toaster } from 'svelte-french-toast'

  import { Logo } from '$lib/components'

  import '../app.postcss'
</script>

<div class="flex min-h-full flex-col">
  <header class="z-10 flex items-center bg-surface-900/95 px-4 pt-2">
    <Logo />
  </header>
  <nav
    class="sticky top-0 z-10 flex items-center gap-4 overflow-auto border-b border-surface-700 bg-surface-900/95 px-4 pt-2"
  >
    <a
      href="/"
      class="navlink"
      class:active={$page.url.pathname === '/'}><span>Promotions</span></a
    >
    <a
      href="/flavor-picker"
      class="navlink"
      class:active={$page.url.pathname === '/flavor-picker'}
      ><span>Flavor Picker</span></a
    >
    <a
      href="/nicotine-calculator/packets"
      class="navlink"
      class:active={$page.url.pathname === '/nicotine-calculator/packets'}
      ><span>Nicotine Packet Calculator</span></a
    >
    <a
      href="/nicotine-calculator/level"
      class="navlink"
      class:active={$page.url.pathname === '/nicotine-calculator/level'}
      ><span>Nicotine Level Calculator</span></a
    >
  </nav>

  <main class="flex grow flex-col">
    <slot />
  </main>

  <footer
    class="border-t border-surface-700 p-2 text-center text-xs font-light"
  >
    Created by Garrett Nelson &copy;2023
  </footer>
</div>

<Toaster
  toastOptions={{
    className:
      '!bg-surface-700 !text-surface-50 !font-medium !rounded-3xl !px-4'
  }}
/>

<style lang="postcss">
  nav {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  a.navlink {
    @apply flex shrink-0 flex-col gap-1 text-surface-400 outline-none transition;

    &.active {
      @apply text-surface-50;
    }

    & span {
      @apply rounded-full border border-transparent px-3 py-1 transition;
    }

    &:hover span {
      @apply bg-surface-800 text-surface-50;
    }

    &:focus-visible span {
      @apply border-surface-100;
    }

    &::after {
      content: '';
      @apply mx-2 h-0.5 rounded-full transition;

      &.active {
        @apply bg-surface-50;
      }
    }
  }
</style>
