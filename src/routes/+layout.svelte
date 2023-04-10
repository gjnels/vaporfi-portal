<script lang="ts">
  import { enhance } from '$app/forms'
  import { invalidate } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { Toaster } from 'svelte-french-toast'

  import { Divider, Logo } from '$components'

  import '../app.postcss'

  export let data
  $: ({ session, currentProfile } = data)
  $: role = currentProfile?.role

  onMount(() => {
    const {
      data: { subscription: authListener }
    } = data.supabase.auth.onAuthStateChange((event, session) => {
      if (data.session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => {
      authListener.unsubscribe()
    }
  })
</script>

<div class="flex min-h-full flex-col">
  <header class="z-40 flex items-center bg-surface-900/95 px-4 pt-2">
    <a
      href="/"
      class="z-40 rounded-lg border border-transparent px-1 outline-none focus-visible:border-surface-600"
    >
      <Logo />
    </a>

    {#if session}
      <form
        class="ml-auto"
        method="post"
        action="/auth?/signout"
        use:enhance={async () => {
          await data.supabase.auth.signOut()
        }}
      >
        <button
          type="submit"
          class="btn btn-small btn-primary">Logout</button
        >
      </form>
    {:else}
      <a
        href="/auth/login"
        class="btn btn-small btn-secondary ml-auto !py-1">Login</a
      >
    {/if}
  </header>
  <nav
    class="sticky top-0 z-40 flex gap-2 overflow-auto border-b border-surface-700 bg-surface-900/95 px-4 pt-2"
  >
    <div class="navlink-section">
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
    </div>
    {#if role === 'Admin'}
      <Divider
        vertical
        styles="h-6 mt-1.5"
      />
      <div class="navlink-section">
        <a
          href="/admin/promotions"
          class="navlink"
          class:active={$page.url.pathname.startsWith('/admin/promotions')}
          ><span>Edit Promotions</span></a
        >
      </div>
    {/if}
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

  .navlink-section {
    @apply flex shrink-0 items-center gap-1;
  }

  a.navlink {
    @apply flex flex-col gap-1 text-surface-400 outline-none transition;

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
