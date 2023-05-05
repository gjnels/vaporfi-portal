<script lang="ts">
  import type { Validation } from 'sveltekit-superforms/index'
  import type { ModalProps } from '@skeletonlabs/skeleton/dist/utilities/Modal/Modal.svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore } from '@skeletonlabs/skeleton'

  import Form from '$components/Form/Form.svelte'
  import type { Promo } from '$lib/types/promos.types'
  import type { deletePromoSchema } from '$lib/schemas/promos'

  // Exposes modalStore parent props to this component
  export let parent: ModalProps

  export let promo: Promo
  export let form: Validation<typeof deletePromoSchema>

  const sForm = superForm(form, {
    onResult: ({ result }) => {
      if (result.type === 'success' || result.type === 'redirect') {
        parent.onClose()
        toastStore.trigger({
          message: `${promo.title} has been deleted.`,
          background: 'variant-filled-success'
        })
      }
    }
  })
  const { form: formStore } = sForm
  $formStore.id = promo.id
</script>

<!-- Default slot to prevent modal warning -->
<slot />

<Form
  action="?/delete&promo_id={promo.id}"
  superForm={sForm}
>
  <p>Are you sure you want to delete this promotion?</p>
  <h3>{promo.title}</h3>

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
