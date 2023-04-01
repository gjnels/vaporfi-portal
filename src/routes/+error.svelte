<script lang="ts">
  import { page } from '$app/stores'
  import {
    Icon,
    ExclamationCircle,
    ShieldExclamation,
    ExclamationTriangle
  } from 'svelte-hero-icons'

  let icon = ExclamationCircle
  let title = 'Oops!'
  let message = 'An unexpected error has occurred. Try again later.'

  switch ($page.status) {
    case 401:
      icon = ExclamationTriangle
      title = 'Unauthenticated'
      message = 'You must be logged in to view this page'
      break
    case 403:
      icon = ShieldExclamation
      title = 'Unauthorized'
      message = 'You are not authorized to view this page'
      break
    case 404:
      title = 'Not found'
      message = 'This page does not exist'
      break
  }

  // Set the error message for any expected errors
  // Errors not thrown from svelte error() will contain 'Error:' in the message
  if ($page.error?.message && !$page.error.message.includes('Error:')) {
    message = $page.error.message
  }
</script>

<div class="mt-10 flex flex-col items-center gap-2">
  <div class="mb-4 flex items-center gap-2 text-rose-400">
    <Icon
      src={icon}
      size="4rem"
      class="text-rose-400"
    />
    <h1 class="text-xl font-bold uppercase">{title}</h1>
  </div>
  <p>{message}</p>
  <a href="/">Return to Home Page</a>
</div>
