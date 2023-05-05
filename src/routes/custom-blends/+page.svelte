<script lang="ts">
  import type { CustomBlend } from '$lib/types/flavors.types'

  // Components
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import CustomBlendList from './CustomBlendList.svelte'
  import { CheckCircle, Icon } from 'svelte-hero-icons'

  export let data

  $: isAdmin = data.currentProfile?.role === 'Admin'
  $: isManager = isAdmin || data.currentProfile?.role === 'Manager'

  // Filter blends based on search terms
  // Includes any blends which have matches to search terms in name or flavors
  let blendSearchTerms = ''
  $: filterBlends = (blends: CustomBlend[]) =>
    blends.filter((blend) =>
      blendSearchTerms.trim().length > 0
        ? blendSearchTerms
            .trim()
            .toLowerCase()
            .split(' ')
            .every(
              (term) =>
                blend.name.toLowerCase().includes(term) ||
                blend.flavor1.flavor.toLowerCase().includes(term) ||
                blend.flavor2?.flavor.toLowerCase().includes(term) ||
                blend.flavor3?.flavor.toLowerCase().includes(term)
            )
        : true
    )

  const approvedBlends = data.blends.filter((blend) => blend.approved)
  const unapprovedBlends = data.blends.filter((blend) => !blend.approved)
  $: filteredApprovedBlends = filterBlends(approvedBlends)
  $: filteredUnapprovedBlends = filterBlends(unapprovedBlends)
</script>

<svelte:head>
  <title>Custom Blends | VF Columbus</title>
</svelte:head>

<PageLayout contentWrapperStyles="space-y-8">
  <svelte:fragment slot="header">
    <h1>Custom Blends</h1>
  </svelte:fragment>

  {#if data.blends.length === 0}
    <p class="text-center italic text-error-500">No custom blends found</p>
  {:else}
    <!-- Above blend list -->
    <div class="flex w-full flex-wrap justify-center gap-4">
      <!-- Search bar -->
      <input
        type="search"
        class="input w-auto grow"
        bind:value={blendSearchTerms}
        placeholder="Search for custom blends"
      />
      <!-- Link to new blend page for managers and admins -->
      {#if isAdmin || isManager}
        <a
          href="/custom-blends/new"
          class="btn btn-sm variant-soft hover:variant-filled-tertiary">Make a new blend</a
        >
      {/if}
    </div>

    <!-- Unapproved blends - only visible to admins -->
    {#if isAdmin}
      <div class="space-y-2">
        <h3>Unapproved Custom Blends</h3>
        {#if unapprovedBlends.length === 0}
          <hr />
          <div class="flex items-center gap-2 italic brightness-75">
            <Icon
              src={CheckCircle}
              size="1.5em"
              solid
              class="text-primary-600 dark:text-primary-500"
            />
            <span>All custom blends are approved</span>
          </div>
        {:else if filteredUnapprovedBlends.length === 0}
          <hr />
          <p class="italic text-error-500">No unapproved custom blends match your search terms</p>
        {:else}
          <CustomBlendList
            blends={filteredUnapprovedBlends}
            form={data.form}
            {isAdmin}
          />
        {/if}
      </div>
    {/if}

    <!-- Approved blends - visible to everyone -->
    <div class="space-y-2">
      {#if isAdmin}
        <h3>Approved Custom Blends</h3>
      {/if}
      {#if approvedBlends.length === 0}
        <p class="italic text-error-500">No {isAdmin ? 'approved' : ''} custom blends found</p>
      {:else if filteredApprovedBlends.length === 0}
        <p class="italic text-error-500">
          No {isAdmin ? 'approved' : ''} custom blends match your search terms
        </p>
      {:else}
        <CustomBlendList
          blends={filteredApprovedBlends}
          form={data.form}
          {isAdmin}
        />
      {/if}
    </div>
  {/if}
</PageLayout>
