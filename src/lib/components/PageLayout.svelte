<!-- 
  @component
  
  Container for the content of each page

  #### Header Container Wrapper
  
  - Wrapper for the page header container to keep the border going all the way across the screen

  #### Header Container

  ```slot``` - "header"
  - container for the page header which maintains a maximum width and centers itself on a large enough screen
  - default max width: screen-2xl

  #### Content Container Wrapper

  - Wrapper for the page content container to keep styles going all the way across the screen (such as a different background color)

  #### Content Container

  ```slot``` - *default*
  - container for the main content of the page
  - default max width: screen-2xl

  ### Props

  @prop ```headerWrapperStyles``` - tailwind classes to add to the wrapper of the page header container

  @prop ```headerContainerStyles``` - tailwind classes to add to the container of the page header

  @prop ```contentWrapperStyles``` - tailwind classes to add to the wrapper of the page content container

  @prop ```contentContainerStyles``` - tailwind classes to add to the container of the page content
  
 -->

<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let headerWrapperStyles = ''
  export let headerContainerStyles = ''
  export let contentWrapperStyles = ''
  export let contentContainerStyles = ''
</script>

{#if $$slots.header}
  <div class={twMerge('border-b border-zinc-700', headerWrapperStyles)}>
    <div
      class={twMerge(
        'mx-auto flex w-full max-w-screen-2xl items-center px-4 py-8 md:px-6',
        headerContainerStyles
      )}
    >
      <slot name="header" />
    </div>
  </div>
{/if}

<div class={twMerge('grow', contentWrapperStyles)}>
  <div
    class={twMerge(
      'mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6',
      contentContainerStyles
    )}
  >
    <slot />
  </div>
</div>
