<script lang="ts">
  import type { SubmitFunction } from '@sveltejs/kit'
  import { enhance } from '$app/forms'
  import { LightSwitch, popup } from '@skeletonlabs/skeleton'
  import { storeTheme } from './stores'
  import themes from './themes'

  import { ChevronDown, Icon, PaintBrush } from 'svelte-hero-icons'

  const setTheme: SubmitFunction = () => {
    return async ({ result, update }) => {
      await update()
      if (result.type === 'success') {
        const theme = result.data?.theme as string
        storeTheme.set(theme)
      }
    }
  }
</script>

<div>
  <button
    class="btn btn-sm hover:variant-soft-primary"
    use:popup={{ event: 'click', target: 'theme', placement: 'bottom-end' }}
  >
    <Icon
      src={PaintBrush}
      size="1.5em"
      solid
    />
    <span class="hidden sm:inline">Theme</span>
    <Icon
      src={ChevronDown}
      size="1em"
    />
  </button>

  <div
    class="card w-60 p-4 shadow-xl"
    data-popup="theme"
  >
    <div class="space-y-4">
      <section class="flex items-center justify-between">
        <h6>Mode</h6>
        <LightSwitch />
      </section>
      <nav class="list-nav -m-4 max-h-64 overflow-y-auto p-4 lg:max-h-[500px]">
        <form
          method="post"
          action="/?/setTheme"
          use:enhance={setTheme}
        >
          <ul>
            {#each themes as theme (theme.type)}
              <li>
                <button
                  type="submit"
                  name="theme"
                  value={theme.type}
                  class="w-full focus:!variant-filled-surface"
                  class:bg-primary-active-token={$storeTheme === theme.type}>{theme.name}</button
                >
              </li>
            {/each}
          </ul>
        </form>
      </nav>
    </div>
  </div>
</div>
