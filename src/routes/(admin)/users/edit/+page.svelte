<script lang="ts">
  import toast from 'svelte-french-toast'
  import { createDialog } from 'svelte-headlessui'
  import {
    ArrowUturnLeft,
    ExclamationCircle,
    ExclamationTriangle,
    Icon
  } from 'svelte-hero-icons'
  import { superForm } from 'sveltekit-superforms/client'

  import { FormControl, FormMessage, Modal, PageLayout } from '$components'

  export let data

  const {
    form: updateForm,
    enhance: updateEnhance,
    message: updateMessage,
    errors: updateErrors,
    constraints: updateConstraints,
    delayed: updateDelayed
  } = superForm(data.updateForm, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      // show toast notification letting user know the update was successful before redirecting
      if (type === 'redirect') {
        toast.success('User has been updated')
      }
    }
  })

  const {
    form: deleteForm,
    enhance: deleteEnhance,
    message: deleteMessage,
    errors: deleteErrors,
    constraints: deleteConstraints,
    delayed: deleteDelayed
  } = superForm(data.deleteForm, {
    dataType: 'json',
    onResult: ({ result: { type } }) => {
      // show toast notification letting user know the delete was successful before redirecting
      if (type === 'redirect') {
        toast.success('User has been deleted')
      }
    }
  })

  const deleteModal = createDialog({ label: 'delete user' })
</script>

<svelte:head>
  <title>Edit User | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="max-w-3xl">
  <svelte:fragment slot="header">
    <h1>Edit User</h1>
    <a
      href="/users"
      class="link link-primary"
    >
      <Icon
        src={ArrowUturnLeft}
        size="1em"
      />
      All Users
    </a>
  </svelte:fragment>

  <div class="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
    <button
      type="button"
      class="btn btn-danger"
      on:click={deleteModal.open}>Delete This User</button
    >
    <span class="flex items-center gap-2 text-warning-400">
      <Icon
        src={ExclamationTriangle}
        size="1.5em"
      />Warning: this cannot be undone
    </span>
  </div>

  <form
    method="post"
    action="?/updateUser"
    use:updateEnhance
    class="form"
  >
    <p class="text-xl">
      Email: <span class="font-semibold">{data.profile.email}</span>
    </p>
    <FormControl
      label="Name"
      errors={$updateErrors.name}
    >
      <input
        type="text"
        bind:value={$updateForm.name}
        data-invalid={$updateErrors.name}
        {...$updateConstraints.name}
        required={false}
      />
    </FormControl>

    <FormControl
      label="Role"
      errors={$updateErrors.role}
    >
      {#if data.profile.id === data.session?.user.id && data.profile.role === 'Admin'}
        <span class="flex items-center gap-1 text-sm text-warning-400">
          <Icon
            src={ExclamationCircle}
            size="1.5em"
            class="inline shrink-0"
          />
          If you change your own role to anything but Admin, only a different Admin
          user can change it back.
        </span>
      {/if}
      <select
        bind:value={$updateForm.role}
        data-invalid={$updateErrors.role}
        {...$updateConstraints.role}
      >
        <option value={null}>None</option>
        <option value={'Store'}>Store</option>
        <option value={'Manager'}>Manager</option>
        <option value={'Admin'}>Admin</option>
      </select>
    </FormControl>

    <FormControl
      label="Locations"
      errors={$updateErrors.locations}
    >
      <div class="flex flex-wrap gap-x-8 gap-y-2">
        {#each data.locations as location}
          <label class="checkbox">
            <input
              type="checkbox"
              bind:checked={$updateForm.locations[location.id]}
            />
            <span>{location.name}</span>
          </label>
        {/each}
      </div>
    </FormControl>

    <FormMessage message={$updateMessage} />

    <button
      type="submit"
      disabled={$updateDelayed}
      class="btn btn-primary"
      >{$updateDelayed ? 'Updating...' : 'Update User'}</button
    >
  </form>

  <Modal
    modalStore={deleteModal}
    modalWindowStyles="flex flex-col gap-4 items-center"
  >
    <p>Are you sure you want to delete this user?</p>

    <span class="flex items-center gap-2 text-warning-400">
      <Icon
        src={ExclamationTriangle}
        size="1.5em"
      />Warning: this cannot be undone
    </span>

    <div class="grid w-full grid-cols-2 gap-4">
      <form
        method="post"
        use:deleteEnhance
        action="?/deleteUser"
        class="contents"
      >
        <button
          type="submit"
          class="btn btn-danger">Yes</button
        >
      </form>
      <button
        type="button"
        class="btn"
        on:click={deleteModal.close}>No</button
      >
    </div>

    <FormMessage message={$deleteMessage} />
  </Modal>
</PageLayout>
