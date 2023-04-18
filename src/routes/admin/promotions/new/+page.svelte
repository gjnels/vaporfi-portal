<script lang="ts">
  import toast from 'svelte-french-toast'
  import { ArrowUturnLeft, Icon } from 'svelte-hero-icons'
  import { superForm } from 'sveltekit-superforms/client'

  import { PageLayout } from '$components'

  import PromoForm from '../PromoForm.svelte'

  export let data

  $: ({ form, customBlends } = data)

  const superform = superForm(form, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      if (type === 'redirect') {
        toast.success('Promotion has been created.')
      }
    }
  })
</script>

<svelte:head>
  <title>Create New Promotion | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="max-w-2xl">
  <svelte:fragment slot="header">
    <h1>Create New Promotion</h1>
    <a
      href="/admin/promotions"
      class="link link-primary"
    >
      <Icon
        src={ArrowUturnLeft}
        size="1em"
      />
      All Promotions
    </a>
  </svelte:fragment>

  <PromoForm
    {superform}
    {customBlends}
  />
</PageLayout>
