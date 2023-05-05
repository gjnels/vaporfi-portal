<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
  import { LightSwitch, popup, storePopup } from '@skeletonlabs/skeleton'
  import { ChevronDown, Icon, UserCircle } from 'svelte-hero-icons'

  export let currentProfile: DatabaseRow<'profiles'>

  storePopup
</script>

<div>
  <button
    class="btn btn-sm hover:variant-soft-primary"
    use:popup={{ event: 'click', target: 'user_menu', placement: 'bottom-end' }}
  >
    <Icon
      src={UserCircle}
      size="1.5em"
      solid
    />
    <span class="hidden sm:inline">{currentProfile.name || currentProfile.email}</span>
    <Icon
      src={ChevronDown}
      size="1em"
    />
  </button>

  <div
    class="card w-60 p-4 shadow-xl"
    data-popup="user_menu"
  >
    <nav class="list-nav -m-4 max-h-64 overflow-y-auto p-4 lg:max-h-[500px]">
      <ul class="space-y-1">
        <li>
          <a
            href="/profile"
            class="w-full focus:variant-filled-surface">My Profile</a
          >
        </li>

        <li>
          <form
            method="post"
            action="/auth?/signout"
            use:enhance={async () => {
              await $page.data.supabase.auth.signOut()
            }}
          >
            <button
              type="submit"
              class="w-full focus:!variant-filled-surface">Logout</button
            >
          </form>
        </li>
      </ul>
    </nav>
  </div>
</div>
