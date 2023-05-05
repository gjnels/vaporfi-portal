<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { z } from 'zod'
  import type { UnwrapEffects } from 'sveltekit-superforms/index'
  import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'

  type Schema = $$Generic<AnyZodObject>
  type Form = SuperForm<UnwrapEffects<Schema>>
  type Field = keyof z.infer<Schema>

  export let form: Form
  export let field: Field
  export let label: string

  const { path, value, errors, constraints } = formFieldProxy(form, field)
  $: boolValue = value as Writable<boolean>
</script>

<label class="flex w-fit items-center gap-2">
  <input
    type="checkbox"
    class="checkbox"
    id={String(path)}
    name={String(path)}
    data-invalid={$errors}
    class:input-error={$errors}
    bind:checked={$boolValue}
    {...$constraints}
    {...$$restProps}
  />
  <span>{label}</span>
</label>
