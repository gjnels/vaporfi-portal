<script lang="ts">
  import { Icon, PencilSquare } from 'svelte-hero-icons'
  import PageLayout from '$components/PageLayout/PageLayout.svelte'

  export let data
  $: ({ profiles } = data)
</script>

<svelte:head>
  <title>Manage Users | VF Columbus</title>
</svelte:head>

<PageLayout headerWrapperStyles="space-y-2">
  <svelte:fragment slot="header">
    <h1>Manage Users</h1>
    <a
      href="/users/invite"
      class="btn btn-sm variant-soft-primary hover:variant-filled-primary">Invite New User</a
    >
  </svelte:fragment>

  {#if profiles.length === 0}
    <span class="text-center text-lg font-medium italic text-error-500">No profiles found</span>
  {:else}
    <div class="table-container">
      <table class="table-hover table">
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
                  class="btn-icon btn-icon-sm variant-soft-secondary hover:variant-filled-secondary"
                >
                  <Icon
                    src={PencilSquare}
                    size="1.5em"
                    solid
                  />
                </a>
              </td>
              <td class:brightness-50={!profile.name}>{profile.name || 'no name'}</td>
              <td>{profile.email}</td>
              <td class:brightness-50={profile.role === null}>{profile.role ?? 'none'}</td>
              {#if profile.locations && profile.locations.length > 0}
                <td>{profile.locations.map(({ name }) => name).join(', ')}</td>
              {:else}
                <td class="brightness-50">none</td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</PageLayout>
