<script lang="ts">
  import type { z } from 'zod'
  import type { UnwrapEffects } from 'sveltekit-superforms/index'
  import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'

  type Schema = $$Generic<AnyZodObject>
  type Form = SuperForm<UnwrapEffects<Schema>>
  type Field = keyof z.infer<Schema>

  export let form: Form
  export let field: Field
  export let label: string
  export let value: string | number

  const { path, value: group, errors, constraints } = formFieldProxy(form, field)
</script>

<label class="flex w-fit items-center gap-1.5">
  <input
    type="radio"
    class="radio"
    id={String(path)}
    name={String(path)}
    data-invalid={$errors}
    class:input-error={$errors}
    {value}
    bind:group={$group}
    {...$constraints}
    {...$$restProps}
  />
  <span>{label}</span>
</label>
