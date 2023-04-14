<script lang="ts">
  import { ArrowUturnLeft, Icon } from 'svelte-hero-icons'
  import { superForm } from 'sveltekit-superforms/client'

  import { PageLayout } from '$components'

  import CustomBlendForm from '../CustomBlendForm.svelte'

  export let data
  $: ({ form, flavors } = data)

  const superform = superForm(form, {
    dataType: 'json'
  })
</script>

<PageLayout contentContainerStyles="max-w-2xl">
  <svelte:fragment slot="header">
    <h1>Edit Custom Blend</h1>
    <a
      href="/custom-blends"
      class="link link-primary"
    >
      <Icon
        src={ArrowUturnLeft}
        size="1em"
      />
      Back to Custom Blends
    </a>
  </svelte:fragment>

  <CustomBlendForm
    {flavors}
    {superform}
    isAdmin
  />
</PageLayout>
