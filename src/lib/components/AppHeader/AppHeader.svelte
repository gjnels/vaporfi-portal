<script>
  import { page } from '$app/stores'
  import { AppBar, drawerStore } from '@skeletonlabs/skeleton'
  import { Bars3, Icon } from 'svelte-hero-icons'
  import Logo from '$components/Logo/Logo.svelte'
  import ThemeSwitcher from '$components/Themes/ThemeSwitcher.svelte'
  import UserMenu from './UserMenu.svelte'
</script>

<AppBar
  shadow="shadow-md"
  padding="px-4 py-2 lg:px-6"
  slotTrail="flex items-center"
>
  <!-- Right side -->
  <svelte:fragment slot="lead">
    <button
      class="btn-icon lg:hidden"
      on:click={() => drawerStore.open()}
      ><Icon
        src={Bars3}
        size="1em"
        class="text-2xl text-surface-800-100-token sm:text-3xl"
      /></button
    >
    <!-- Logo -->
    <a href="/">
      <Logo />
    </a>
  </svelte:fragment>

  <!-- Left side -->
  <svelte:fragment slot="trail">
    <!-- Set theme -->
    <ThemeSwitcher />

    <!-- Login link or user menu -->
    {#if $page.data.currentProfile}
      <!-- User menu -->
      <UserMenu currentProfile={$page.data.currentProfile} />
    {:else}
      <!-- Login link -->
      <a
        href={$page.url.pathname.startsWith('/login')
          ? $page.url.pathname + $page.url.search
          : `/login${
              $page.url.pathname !== '/'
                ? `?redirectTo=${$page.url.pathname + $page.url.search}`
                : ''
            }`}
        class="btn btn-sm variant-filled-secondary">Login</a
      >
    {/if}
  </svelte:fragment>
</AppBar>
