import { fail } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

import {
  changePasswordRefinedSchema,
  changePasswordSchema
} from '$lib/schemas/auth.js'

export const load = async () => {
  return {
    form: superValidate<typeof changePasswordSchema, Message>(
      null,
      changePasswordSchema
    )
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate<
      typeof changePasswordRefinedSchema,
      Message
    >(event, changePasswordRefinedSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals
    const { error } = await supabase.auth.updateUser({
      password: form.data.password
    })

    if (error) {
      return message(
        form,
        {
          type: 'error',
          message: ['Failed to update password.', error.message]
        },
        { status: error.status ?? 500 }
      )
    }

    return message(
      form,
      { type: 'success', message: 'Your password has been updated.' },
      {
        status: 200
      }
    )
  }
}
