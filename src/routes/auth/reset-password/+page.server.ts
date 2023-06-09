import { AuthApiError } from '@supabase/supabase-js'
import { fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

import { emailSchema } from '$lib/schemas/auth'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
  if (await getSession()) {
    throw redirect(303, '/password-change')
  }
  return { form: superValidate(null, emailSchema) }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate<typeof emailSchema, Message>(event, emailSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals

    const redirectTo = `${event.url.origin}/auth/redirect?action=password-reset`

    const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, { redirectTo })

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return setError(form, 'email', 'Email address not found')
      }

      return message(
        form,
        { type: 'error', message: error.message },
        {
          status: error.status ?? 500
        }
      )
    }

    return message(
      form,
      { type: 'success', message: 'A reset link has been sent to your inbox.' },
      {
        status: 200
      }
    )
  }
}
