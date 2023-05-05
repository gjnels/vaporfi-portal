<script lang="ts">
  import type { z } from 'zod'
  import type { UnwrapEffects } from 'sveltekit-superforms/index'
  import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
  import { capitalize } from '$lib/utils/strings'

  import FormControl from './FormControl.svelte'

  type Schema = $$Generic<AnyZodObject>
  type Form = SuperForm<UnwrapEffects<Schema>>
  type Field = keyof z.infer<Schema>

  export let form: Form
  export let field: Field
  export let label: string | false = ''

  const { path, value, errors, constraints } = formFieldProxy(form, field)
</script>

<FormControl
  label={label === false ? '' : capitalize(label || String(path))}
  errors={$errors}
>
  <input
    type="text"
    class="input"
    id={String(path)}
    name={String(path)}
    data-invalid={$errors}
    class:input-error={$errors}
    bind:value={$value}
    {...$constraints}
    {...$$restProps}
  />
</FormControl>
