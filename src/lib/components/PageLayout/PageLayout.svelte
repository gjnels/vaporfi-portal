<!-- 
  @component
  
  Container for the content of each page

  #### Header Container

  ```slot``` - "header"
  - container for the page header which maintains a maximum width and centers itself on a large enough screen
  - default max width: screen-2xl

  #### Content Container

  ```slot``` - *default*
  - container for the main content of the page
  - default max width: screen-2xl

  ### Props

  @prop ```width``` - tailwind classes to apply width styles to both the header and content sections

  @prop ```headerContainerStyles``` - tailwind classes to add to the outer container of the page header

  @prop ```headerWrapperStyles``` - tailwind classes to add to the inner wrapper of the page header content

  @prop ```contentContainerStyles``` - tailwind classes to add to the outer container of the page content

  @prop ```contentWrapperStyles``` - tailwind classes to add to the inner wrapper of the page content
  
 -->
<script lang="ts">
  import { twMerge } from 'tailwind-merge'

  export let width = ''
  export let headerWrapperStyles = ''
  export let headerContainerStyles = ''
  export let contentWrapperStyles = ''
  export let contentContainerStyles = ''
</script>

{#if $$slots.header}
  <div class={twMerge('container mx-auto', width, headerContainerStyles)}>
    <div class={twMerge('px-4 py-8 lg:px-6', headerWrapperStyles)}>
      <slot name="header" />
    </div>
  </div>

  <hr />
{/if}

<div class={twMerge('container mx-auto', width, contentContainerStyles)}>
  <div class={twMerge('mx-auto px-4 py-8 lg:px-6', contentWrapperStyles)}>
    <slot />
  </div>
</div>
