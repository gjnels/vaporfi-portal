<script lang="ts">
  import type { CustomBlend } from '$lib/types/flavors.types'
  import type { copyCustomBlendSchema } from '$lib/schemas/customBlends'
  import type { Validation } from 'sveltekit-superforms/index'
  import type { ModalProps } from '@skeletonlabs/skeleton/dist/utilities/Modal/Modal.svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import { createDisplayBlendString } from '$lib/utils/flavors'
  import { copyBlendToClipboard } from '$lib/utils/clipboard'

  // Components
  import Form from '$components/Form/Form.svelte'
  import NumberInput from '$components/FormControls/NumberInput.svelte'

  // Exposes modalStore parent props to this component
  export let parent: ModalProps

  export let form: Validation<typeof copyCustomBlendSchema>
  export let blend: CustomBlend

  const sForm = superForm(form, {
    invalidateAll: false,
    onUpdated: async ({ form }) => {
      if (form.valid) {
        const { nicotine, bottleCount } = form.data
        if (
          await copyBlendToClipboard({
            ...blend,
            nicotine,
            bottleCount
          })
        ) {
          // Close modal
          parent.onClose()
        }
      }
    }
  })
</script>

<Form superForm={sForm}>
  <div>
    <h3>{blend.name}</h3>
    <p>{createDisplayBlendString(blend)}</p>
  </div>

  <NumberInput
    form={sForm}
    field="nicotine"
    label="Nicotine Level"
    step="any"
  />

  <NumberInput
    form={sForm}
    field="bottleCount"
    label="Number of Bottles"
  />

  <!-- Default slot for modal component (only here to prevent console warning) -->
  <slot />

  <svelte:fragment slot="actions">
    <button
      type="button"
      on:click={parent.onClose}
      class="btn variant-filled-surface hover:variant-filled">Cancel</button
    >
    <button
      type="submit"
      class="btn variant-filled-primary">Submit</button
    >
  </svelte:fragment>
</Form>
