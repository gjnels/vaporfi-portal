<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
  import { copyBlendToClipboard } from '$lib/utils/clipboard'

  // Components
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import BlendForm from './BlendForm.svelte'

  export let data

  const sForm = superForm(data.form, {
    invalidateAll: false,
    onUpdated: (event) => {
      if (event.form.valid) {
        copyBlendToClipboard($form)
      }
    }
  })

  $: ({ form } = sForm)
</script>

<svelte:head>
  <title>Flavor Picker | VF Columbus</title>
</svelte:head>

<PageLayout>
  <svelte:fragment slot="header">
    <h1>Flavor Picker</h1>
  </svelte:fragment>

  <BlendForm
    {sForm}
    flavors={data.flavors}
  />
</PageLayout>
