<script lang="ts">
  import { Icon, PencilSquare } from 'svelte-hero-icons'

  import { PageLayout } from '$components'

  export let data
  $: ({ profiles } = data)
</script>

<svelte:head>
  <title>Manage Users | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Manage Users</h1>
    <a
      href="/users/invite"
      class="btn btn-primary btn-small">Invite New User</a
    >
  </svelte:fragment>

  {#if profiles.length === 0}
    <span class="text-center text-lg font-medium italic text-danger-500"
      >No profiles found</span
    >
  {:else}
    <div class="styled-table">
      <table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Locations</th>
          </tr>
        </thead>
        <tbody>
          {#each profiles as profile (profile.id)}
            <tr>
              <td>
                <a
                  href="/users/edit?profile_id={profile.id}"
                  title="Edit this user"
                  class="btn btn-secondary btn-icon mx-auto w-fit"
                >
                  <Icon
                    src={PencilSquare}
                    size="1.5rem"
                    solid
                  />
                </a>
              </td>
              <td class:text-surface-500={!profile.name}
                >{profile.name || 'no name'}</td
              >
              <td>{profile.email}</td>
              <td class:text-surface-500={profile.role === null}
                >{profile.role ?? 'none'}</td
              >
              {#if profile.locations}
                {#if Array.isArray(profile.locations)}
                  {#if profile.locations.length === 0}
                    <td class="text-surface-400">none</td>
                  {:else}
                    <td
                      >{profile.locations
                        .map(({ name }) => name)
                        .join(', ')}</td
                    >
                  {/if}
                {:else}
                  <td>{profile.locations.name}</td>
                {/if}
              {:else}
                <td class="text-surface-500">none</td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</PageLayout>
