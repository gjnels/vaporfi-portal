<script lang="ts">
  import type { Validation } from 'sveltekit-superforms/index'
  import type { ModalProps } from '@skeletonlabs/skeleton/dist/utilities/Modal/Modal.svelte'
  import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
  import type { userIdSchema } from '$lib/schemas/profiles'
  import { superForm } from 'sveltekit-superforms/client'
  import { toastStore } from '@skeletonlabs/skeleton'

  import Form from '$components/Form/Form.svelte'

  // Exposes modalStore parent props to this component
  export let parent: ModalProps

  export let profile: DatabaseRow<'profiles'>
  export let form: Validation<typeof userIdSchema>

  const sForm = superForm(form, {
    onResult: ({ result }) => {
      if (result.type === 'success' || result.type === 'redirect') {
        parent.onClose()
        toastStore.trigger({
          message: `User has been deleted.`,
          background: 'variant-filled-success'
        })
      }
    }
  })

  const { form: formStore } = sForm
  $formStore.id = profile.id
</script>

<!-- Default slot to prevent modal warning -->
<slot />

<Form
  action="?/delete&user_id={profile.id}"
  superForm={sForm}
>
  <p>Are you sure you want to delete this user?</p>
  <div class="mx-auto grid max-w-lg grid-cols-[auto,_1fr] gap-3">
    <span class="text-right brightness-90">Name:</span>
    <span class:brightness-50={!profile.name}>{profile.name || 'none'}</span>
    <span class="text-right brightness-90">Email:</span>
    <span>{profile.email}</span>
    <span class="text-right brightness-90">Role:</span>
    <span class:brightness-50={!profile.role}>{profile.role ?? 'none'}</span>
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
