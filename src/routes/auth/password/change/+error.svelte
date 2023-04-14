<script lang="ts">
  import { Icon, ShieldExclamation } from 'svelte-hero-icons'

  import { page } from '$app/stores'

  import { PageLayout } from '$components'
</script>

<svelte:head>
  <title>An error has occured | VF Columbus</title>
</svelte:head>

<PageLayout contentContainerStyles="w-fit flex items-center flex-col gap-2">
  <div class="flex items-center gap-2">
    <Icon
      src={ShieldExclamation}
      size="4rem"
      class="text-danger-500"
      solid
    />
    <h1 class="text-2xl font-medium">
      You must be logged in to change your password
    </h1>
  </div>
  <a
    href="/auth/login?redirectTo={$page.url.pathname}"
    class="link link-primary">Login to your account.</a
  >
  <p>
    If you forgot your password, <a
      href="reset"
      class="link link-secondary">get a reset link</a
    >.
  </p>
</PageLayout>
