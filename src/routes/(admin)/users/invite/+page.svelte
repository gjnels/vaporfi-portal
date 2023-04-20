<script lang="ts">
  import toast from 'svelte-french-toast'
  import { ArrowUturnLeft, Icon } from 'svelte-hero-icons'
  import { superForm } from 'sveltekit-superforms/client'

  import { FormControl, FormMessage, PageLayout } from '$components'

  export let data

  const { form, enhance, message, errors, constraints, delayed } = superForm(
    data.form,
    {
      dataType: 'json',
      onResult: ({ result: { type } }) => {
        if (type === 'success' || type === 'redirect') {
          toast.success('An invitation email has been sent to ' + $form.email, {
            duration: 4000
          })
        }
      }
    }
  )
</script>

<svelte:head>
  <title>Invite New User | VF Columbus</title>
</svelte:head>

<PageLayout
  contentContainerStyles="max-w-4xl"
  headerContainerStyles="max-w-4xl"
>
  <svelte:fragment slot="header">
    <h1>Invite A New User</h1>
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

  <form
    method="post"
    use:enhance
    class="form"
  >
    <FormControl
      label="Email Address"
      errors={$errors.email}
    >
      <input
        type="email"
        bind:value={$form.email}
        data-invalid={$errors.email}
        {...$constraints.email}
      />
    </FormControl>

    <FormControl
      label="Name"
      errors={$errors.name}
    >
      <input
        type="text"
        bind:value={$form.name}
        data-invalid={$errors.name}
        {...$constraints.name}
        required={false}
      />
    </FormControl>

    <FormControl
      label="Role"
      errors={$errors.role}
    >
      <select
        bind:value={$form.role}
        data-invalid={$errors.role}
        {...$constraints.role}
      >
        <option value={null}>None</option>
        <option value={'Store'}>Store</option>
        <option value={'Manager'}>Manager</option>
        <option value={'Admin'}>Admin</option>
      </select>
    </FormControl>

    <FormControl
      label="Locations"
      errors={$errors.locations}
    >
      <div class="flex flex-wrap gap-x-8 gap-y-2">
        {#each data.locations as location}
          <label class="checkbox">
            <input
              type="checkbox"
              bind:checked={$form.locations[location.id]}
            />
            <span>{location.name}</span>
          </label>
        {/each}
      </div>
    </FormControl>

    <div class="form-actions flex flex-wrap items-center gap-4">
      <FormMessage message={$message} />
      <button
        type="submit"
        disabled={$delayed}
        class="btn btn-primary ml-auto"
        >{$delayed ? 'Inviting...' : 'Invite User'}</button
      >
    </div>
  </form>
</PageLayout>
