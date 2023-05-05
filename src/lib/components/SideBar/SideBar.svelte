<script lang="ts">
  import { menuNavLinks, type MenuNavLink } from '$lib/links'
  import { page } from '$app/stores'
  import { twMerge } from 'tailwind-merge'
  import { drawerStore } from '@skeletonlabs/skeleton'
  import { afterNavigate } from '$app/navigation'
  import { BellAlert, Icon } from 'svelte-hero-icons'

  export let mobile = false

  $: role = $page.data.currentProfile?.role ?? null
  // Filter links that do not have the required roles met
  $: filteredMenuNavLinks = menuNavLinks($page.data).filter(({ roles }) => {
    // No requirements, return full list
    if (!roles || roles.length === 0) return true
    // Auth required, filter out if no session
    if (roles === 'authed') return $page.data.session
    // Role(s) required, filter out if current user does not have required role
    return role && roles.includes(role)
  })

  const isActiveLink = (link: MenuNavLink) => {
    const activeType = typeof link.active === 'function' ? link.active(role) : link.active
    switch (activeType) {
      case 'exact':
        return $page.url.pathname === link.href
      case 'startsWith':
        return $page.url.pathname.startsWith(link.href)
      default:
        return false
    }
  }

  // Close sidebar drawer after navigation when this is a mobile sidebar
  if (mobile) {
    afterNavigate((navigation) => {
      if (navigation.type === 'link' || navigation.type === 'goto') {
        drawerStore.close()
      }
    })
  }
</script>

<div
  class={twMerge(
    'h-full space-y-4 overflow-y-auto border-r p-4 pb-10 bg-surface-50-900-token border-surface-300-600-token',
    $$props.class
  )}
>
  <slot name="before" />

  {#each filteredMenuNavLinks as { id, title, list }, idx (id)}
    {#if list.length > 0}
      {#if idx > 0}
        <hr class="!my-6" />
      {/if}
      <div
        {id}
        class="px-4 font-bold uppercase text-primary-600 dark:text-primary-500"
      >
        {title}
      </div>
      <nav class="list-nav">
        <ul>
          {#each list.filter(({ roles }) => {
            // No requirements, return full list
            if (!roles || roles.length === 0) return true
            // Auth required, filter out if no session
            if (roles === 'authed') return $page.data.session
            // Role(s) required, filter out if current user does not have required role
            return role && roles.includes(role)
          }) as link}
            {@const active = isActiveLink(link)}
            <li>
              <a
                href={link.href}
                class:bg-primary-active-token={active}
                class:relative={link.notification}
              >
                <span>{link.label}</span>
                {#if link.notification && !active}
                  <!-- <div
                    class="variant-filled-secondary absolute -left-5 h-3 w-3 animate-pulse rounded-full"
                  /> -->
                  <Icon
                    src={BellAlert}
                    size="1em"
                    solid
                    class="absolute -left-5 rounded-full text-secondary-500-400-token motion-safe:animate-bounce"
                  />
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  {/each}

  <slot name="after" />
</div>
