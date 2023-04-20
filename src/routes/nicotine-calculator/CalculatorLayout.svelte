<script lang="ts">
  import { Divider } from '$components'
</script>

<div class="grid gap-12 lg:grid-cols-2">
  <!-- Available packets and form -->
  <div class="grid grow gap-6 sm:grid-cols-[auto,_1fr]">
    <slot name="form" />
  </div>

  <div class="row-start-1 flex grow flex-col items-center gap-2 lg:row-auto">
    <h2 class="text-2xl font-semibold text-surface-100">Results</h2>
    <Divider styles="self-stretch" />
    <slot name="result" />
  </div>
</div>
