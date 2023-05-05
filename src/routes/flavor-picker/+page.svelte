<script lang="ts">
  import cuid2 from '@paralleldrive/cuid2'
  import { superForm } from 'sveltekit-superforms/client'
  import { savedBlends, storeSavedBlends } from '$lib/stores/savedBlends'
  import type { FlavorPickerBlend, SavedFlavorPickerBlend } from '$lib/types/flavors.types'
  import { copyBlendToClipboard } from '$lib/utils/clipboard'

  // Components
  import PageLayout from '$components/PageLayout/PageLayout.svelte'
  import BlendList from './BlendList.svelte'
  import BlendForm from './BlendForm.svelte'

  export let data

  // Maximum number of blends to save in local storage
  const MAX_SAVED_BLENDS = 10

  const sForm = superForm(data.form, {
    invalidateAll: false,
    onResult: ({ result }) => {
      if (result.type === 'success' && result.data) {
        // Get blend data from form
        // If it does not have an id, create a new one
        const data = result.data.form.data as FlavorPickerBlend
        const blend: SavedFlavorPickerBlend = data.id
          ? { ...data, id: data.id }
          : { ...data, id: cuid2.createId() }

        // Store the blend in savedBlends with a limit on the number of saved blends
        $savedBlends = [
          blend,
          ...$savedBlends.filter((savedBlend) => savedBlend.id !== blend.id)
        ].slice(0, MAX_SAVED_BLENDS)

        if (data.id) {
          // This is an already existing saved blend
          // Reset form to prevent unwanted update of a saved blend
          reset({ keepMessage: false })
        }

        // Save blends to storage
        storeSavedBlends()

        // Copy blend string to clipboard
        copyBlendToClipboard(blend)
      }
    }
  })

  $: ({ form, reset } = sForm)

  // Set form values to the selected blend to edit
  const editBlend = (blend: SavedFlavorPickerBlend) => {
    $form = { ...blend }
  }

  // Delete a saved blend from savedBlends and store the new savedBlends to localStorage
  const deleteBlend = (blend: SavedFlavorPickerBlend) => {
    $savedBlends = $savedBlends.filter((savedBlend) => savedBlend.id !== blend.id)
    storeSavedBlends()

    // If the form is currently editing this deleted blend, reset the entire form
    if ($form.id === blend.id) reset({ keepMessage: false })
  }
</script>

<svelte:head>
  <title>Flavor Picker | VF Columbus</title>
</svelte:head>

<PageLayout contentWrapperStyles="grid xl:grid-cols-2 gap-10">
  <svelte:fragment slot="header">
    <h1>Flavor Picker</h1>
  </svelte:fragment>

  <BlendForm
    {sForm}
    flavors={data.flavors}
  />

  <BlendList
    onEdit={editBlend}
    onDelete={deleteBlend}
    onClear={() => sForm.reset({ keepMessage: false })}
  />
</PageLayout>
