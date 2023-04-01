{#if $$slots.header}
  <div class="border-b border-gray-800">
    <div
      class="mx-auto flex w-full max-w-screen-2xl items-center px-4 py-6 md:px-6"
    >
      <slot name="header" />
    </div>
  </div>
{/if}

<div class="mx-auto w-full max-w-screen-2xl px-4 py-4 md:px-6">
  <slot />
</div>
