<script lang="ts">
  import type { deleteCustomBlendSchema } from '$lib/schemas/customBlends'
  import type { CustomBlend } from '$lib/types/flavors.types'
  import type { Validation } from 'sveltekit-superforms/index'
  import type { ModalProps } from '@skeletonlabs/skeleton/dist/utilities/Modal/Modal.svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore } from '@skeletonlabs/skeleton'
  import { createDisplayBlendString } from '$lib/utils/flavors'

  import Form from '$components/Form/Form.svelte'

  // Exposes modalStore parent props to this component
  export let parent: ModalProps

  export let blend: CustomBlend
  export let form: Validation<typeof deleteCustomBlendSchema>

  const sForm = superForm(form, {
    onResult: ({ result }) => {
      if (result.type === 'success' || result.type === 'redirect') {
        parent.onClose()
        toastStore.trigger({
          message: `${blend.name} has been deleted.`,
          background: 'variant-filled-success'
        })
      }
    }
  })
  const { form: formStore } = sForm
</script>

<!-- Default slot to prevent modal warning -->
<slot />

<Form
  action="?/deleteBlend&blend_id={blend.id}"
  superForm={sForm}
>
  <p>Are you sure you want to delete this custom blend?</p>
  <div>
    <h3>{blend.name}</h3>
    <p>{createDisplayBlendString(blend)}</p>
  </div>

  <input
    hidden
    type="hidden"
    id="id"
    name="id"
    class="absolute -left-[9999px] hidden h-0 w-0"
    bind:value={$formStore.id}
  />

  <svelte:fragment slot="actions">
    <button
      type="button"
      class="btn variant-filled-surface hover:variant-filled"
      on:click={() => {
        parent.onClose()
        sForm.reset({ keepMessage: false })
      }}>Cancel</button
    >
    <button
      type="submit"
      class="btn variant-filled-error">Delete</button
    >
  </svelte:fragment>
</Form>
