import { fail } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import { changePasswordRefinedSchema, changePasswordSchema } from '$lib/schemas/auth.js'
import type { Actions, PageServerLoad } from './$types'
import { requireAuth } from '$lib/utils/auth'

export const load = (async (event) => {
  await requireAuth(event)

  return {
    form: superValidate(changePasswordSchema)
  }
}) satisfies PageServerLoad

export const actions = {
  default: async (event) => {
    const form = await superValidate<typeof changePasswordRefinedSchema, Message>(
      event,
      changePasswordRefinedSchema
    )

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
} satisfies Actions
