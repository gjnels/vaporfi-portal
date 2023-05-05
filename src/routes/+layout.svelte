<script lang="ts">
  // Order of these imports must remain the same
  // import '$lib/themes/theme-vf.css' // theme
  import '@skeletonlabs/skeleton/styles/all.css' // skeleton styles
  import '../app.css' // additional app-wide styles

  import type { RealtimeChannel } from '@supabase/supabase-js'
  import { onMount } from 'svelte'
  import { invalidate } from '$app/navigation'
  import { profileUpdate } from '$lib/stores/profileUpdate'

  // Components
  import { AppShell, Drawer, Modal, Toast, toastStore } from '@skeletonlabs/skeleton'
  import AppHeader from '$components/AppHeader/AppHeader.svelte'
  import SideBar from '$components/SideBar/SideBar.svelte'

  // Floating ui for popups
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom'
  import { storePopup } from '@skeletonlabs/skeleton'
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })

  export let data
  $: ({ session, supabase, currentThemeCSS } = data)

  onMount(() => {
    const {
      data: { subscription: authListener }
    } = supabase.auth.onAuthStateChange((event, _session) => {
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
            // prevent invalidation when user updates their own profile
            if ($profileUpdate.external) {
              toastStore.trigger({
                message: 'Your profile has been updated.',
                background: 'variant-filled-surface'
              })
            }
            invalidate('supabase:auth')
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
              toastStore.trigger({
                message: 'Your account has been removed.',
                background: 'variant-filled-warning'
              })
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

  let windowWidth: number
  $: modalPosition = windowWidth < 640 ? 'items-start' : 'items-center'
  $: modalFlyY = windowWidth < 640 ? -100 : 100
</script>

<svelte:head>
  {@html `<style>${currentThemeCSS}}</style>`}
</svelte:head>

<svelte:window bind:innerWidth={windowWidth} />

<Modal
  bind:position={modalPosition}
  bind:flyY={modalFlyY}
/>
<Toast position="tr" />
<Drawer
  class="lg:hidden"
  rounded="rounded-none"
>
  <SideBar mobile />
</Drawer>

<!-- App shell -->
<AppShell>
  <!-- App bar -->
  <svelte:fragment slot="header">
    <AppHeader />
  </svelte:fragment>

  <!-- Sidebar Left -->
  <svelte:fragment slot="sidebarLeft">
    <SideBar class="hidden lg:block" />
  </svelte:fragment>

  <!-- Page content -->
  <slot />

  <!-- Page footer -->
  <svelte:fragment slot="pageFooter">
    <footer class="border-t p-2 text-center text-sm font-light border-surface-300-600-token">
      Created by Garrett Nelson &copy;2023
    </footer>
  </svelte:fragment>
</AppShell>
