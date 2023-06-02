import { AuthApiError } from '@supabase/supabase-js'
import { fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

import { loginSchema } from '$lib/schemas/auth.js'
import { parseRedirect } from '$lib/utils/auth.js'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ locals: { getSession }, url: { searchParams } }) => {
  const session = await getSession()

  // Redirect when there is a valid session
  // No need to see login page if user is already logged in
  if (session) {
    throw redirect(303, searchParams.get('redirectTo') || '/')
  }

  return {
    form: superValidate<typeof loginSchema>(null, loginSchema)
  }
}) satisfies PageServerLoad

export const actions = {
  default: async (event) => {
    const form = await superValidate<typeof loginSchema, Message>(event, loginSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    const {
      locals: { supabase }
    } = event

    const { error } = await supabase.auth.signInWithPassword(form.data)

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return message(form, { type: 'error', message: error.message }, { status: 400 })
      }
      return message(
        form,
        {
          type: 'error',
          message: ['Unable to login at this time.', error.message]
        },
        {
          status: error.status ?? 500
        }
      )
    }

    const redirectToParam = event.url.searchParams.get('redirectTo')

    throw redirect(303, redirectToParam ? parseRedirect(redirectToParam) : '/')
  }
} satisfies Actions
