<script lang="ts">
  import type { RealtimeChannel } from '@supabase/supabase-js'
  import { onMount } from 'svelte'
  import toast, { Toaster } from 'svelte-french-toast'
  import { createMenu } from 'svelte-headlessui'
  import {
    ArrowLeftOnRectangle,
    ChevronDown,
    Icon,
    UserCircle
  } from 'svelte-hero-icons'
  import { quadOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  import { enhance } from '$app/forms'
  import { invalidate } from '$app/navigation'
  import { page } from '$app/stores'

  import { profileUpdate } from '$lib/stores/profileUpdate'

  import { Divider, Logo } from '$components'

  import '../app.postcss'

  export let data
  $: ({ session, supabase, currentProfile } = data)
  $: role = currentProfile?.role

  onMount(() => {
    const {
      data: { subscription: authListener }
    } = supabase.auth.onAuthStateChange((event, _session) => {
      console.log('auth event: ', event)
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    let profileListener: RealtimeChannel

    if (session) {
      profileListener = supabase
        .channel('any')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`
          },
          () => {
            if ($profileUpdate.external) {
              toast('Your profile has been updated')
              invalidate('supabase:auth')
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`
          },
          (payload) => {
            // supabase filter does not work for delete messages
            // check this deleted record is the current user's record
            if (session && payload.old.id === session.user.id) {
              toast('Your account has been removed')
              invalidate('supabase:auth')
            }
          }
        )
        .subscribe()
    }

    return () => {
      authListener.unsubscribe()
      profileListener?.unsubscribe()
    }
  })

  const userMenu = createMenu({ label: 'user menu' })
</script>

<div class="flex min-h-full flex-col">
  <header class="relative z-50 flex items-center bg-surface-900/95 px-4 pt-2">
    <a
      href="/"
      class="z-40 rounded-lg border border-transparent px-1 outline-none focus-visible:border-surface-600"
    >
      <Logo />
    </a>

    {#if session}
      <button
        type="button"
        class="btn btn-transparent btn-small ml-auto"
        use:userMenu.button
        >{currentProfile?.name || session.user.email}<Icon
          src={ChevronDown}
          width="20px"
          class="transition-transform {$userMenu.expanded ? '-rotate-180' : ''}"
        /></button
      >
      {#if $userMenu.expanded}
        <div
          class="user-menu absolute right-4 top-full mt-2 flex min-w-[10rem] flex-col gap-1 rounded-lg border border-surface-500 bg-surface-700 py-2 shadow outline-none transition"
          use:userMenu.items
          in:slide={{ axis: 'y', duration: 300, easing: quadOut }}
          out:slide={{ axis: 'y', duration: 150, easing: quadOut }}
        >
          <a
            href="/profile"
            use:userMenu.item
            class="flex items-center gap-2 px-3 py-1 text-left outline-none transition {$userMenu.active ===
            'My Profile'
              ? 'bg-secondary-600'
              : ''}"
            ><Icon
              src={UserCircle}
              size="1.5em"
              class="transition {$userMenu.active === 'My Profile'
                ? 'text-surface-50'
                : 'text-secondary-500'}"
            />My Profile</a
          >
          <form
            class="contents"
            method="post"
            action="/auth?/signout"
            use:enhance={async () => {
              await data.supabase.auth.signOut()
            }}
          >
            <button
              type="submit"
              use:userMenu.item
              class="flex items-center gap-2 px-3 py-1 text-left outline-none transition {$userMenu.active ===
              'Logout'
                ? 'bg-secondary-600'
                : ''}"
              ><Icon
                src={ArrowLeftOnRectangle}
                size="1.5em"
                class="transition {$userMenu.active === 'Logout'
                  ? 'text-surface-50'
                  : 'text-secondary-500'}"
              />Logout</button
            >
          </form>
        </div>
      {/if}
    {:else}
      <a
        href={$page.url.pathname.startsWith('/login')
          ? $page.url.pathname + $page.url.search
          : `/login${
              $page.url.pathname !== '/'
                ? `?redirectTo=${$page.url.pathname + $page.url.search}`
                : ''
            }`}
        class="btn btn-small btn-secondary ml-auto">Login</a
      >
    {/if}
  </header>
  <nav
    class="sticky top-0 z-30 flex gap-2 overflow-auto border-b border-surface-700 bg-surface-900/95 px-4 pt-2"
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
        href="/custom-blends"
        class="navlink"
        class:active={$page.url.pathname.startsWith('/custom-blends')}
        ><span>Custom Blends</span></a
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
      <a
        href="/missing-sku"
        class="navlink"
        class:active={$page.url.pathname === '/missing-sku'}
        ><span>Missing SKUs</span></a
      >
      <a
        href="/incorrect-sku"
        class="navlink"
        class:active={$page.url.pathname === '/incorrect-sku'}
        ><span>Incorrect SKUs</span></a
      >
    </div>
    {#if role === 'Admin'}
      <Divider
        vertical
        styles="h-6 mt-1.5"
      />
      <div class="navlink-section">
        <a
          href="/promotions"
          class="navlink"
          class:active={$page.url.pathname.startsWith('/promotions')}
          ><span>Manage Promotions</span></a
        >
        <a
          href="/users"
          class="navlink"
          class:active={$page.url.pathname.startsWith('/users')}
          ><span>Manage Users</span></a
        >
        <a
          href="/missing-sku/manage"
          class="navlink"
          class:active={$page.url.pathname.startsWith('/missing-sku/manage')}
          ><span>Manage Missing SKUs</span></a
        >
        <a
          href="/incorrect-sku/manage"
          class="navlink"
          class:active={$page.url.pathname.startsWith('/incorrect-sku/manage')}
          ><span>Manage Incorrect SKUs</span></a
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
