<div class="grid gap-12 2xl:grid-cols-2">
  <!-- Available packets and form -->
  <div class="grid gap-6 sm:grid-cols-[auto,_1fr]">
    <slot name="form" />
  </div>

  <div class="row-start-1 flex flex-col items-center gap-2 2xl:row-auto">
    <h3>Results</h3>
    <hr class="w-full" />
    <slot name="result" />
  </div>
</div>
