<script lang="ts">
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import AdminSkuTable from '$components/Skus/AdminSkuTable.svelte'

  export let data

  $: ({ updateForm, deleteForm } = data)

  $: unfixedSkus = data.skus.filter(({ fixed }) => !fixed)
  $: fixedSkus = data.skus.filter(({ fixed }) => fixed)
</script>

<svelte:head>
  <title>Manage Incorrect SKUs | VF Columbus</title>
</svelte:head>

<PageLayout contentWrapperStyles="space-y-8">
  <svelte:fragment slot="header">
    <h1>Manage Incorrect SKUs</h1>
  </svelte:fragment>

  <div class="space-y-2">
    <h3>Incorrect SKUs to be Fixed</h3>
    {#if unfixedSkus.length === 0}
      <p class="text-primary-600 dark:text-primary-500">None found!</p>
    {:else}
      <AdminSkuTable
        type="incorrect"
        skus={unfixedSkus}
        {updateForm}
        {deleteForm}
      />
    {/if}
  </div>

  <hr />

  <div class="space-y-2">
    <h3>Fixed Incorrect SKUs</h3>
    {#if fixedSkus.length === 0}
      <p class="text-primary-600 dark:text-primary-500">None found!</p>
    {:else}
      <AdminSkuTable
        type="incorrect"
        skus={fixedSkus}
        {updateForm}
        {deleteForm}
      />
    {/if}
  </div>
</PageLayout>
