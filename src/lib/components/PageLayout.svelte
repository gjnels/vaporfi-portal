{#if $$slots.header}
  <div class="border-b border-zinc-700">
    <div
      class="mx-auto flex w-full max-w-screen-2xl items-center px-4 py-8 md:px-6"
    >
      <slot name="header" />
    </div>
  </div>
{/if}

<div class="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6">
  <slot />
</div>
