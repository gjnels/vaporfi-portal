import { AuthApiError } from '@supabase/supabase-js'
import { fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

import {
  changePasswordRefinedSchema,
  emailSchema,
  loginSchema
} from '$lib/schemas/auth'

import { redirects } from './redirectActions'

export const load = async () => {
  throw redirect(303, '/')
}

export const actions = {
  signin: async (event) => {
    const form = await superValidate(event, loginSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    const {
      locals: { supabase }
    } = event

    const { error } = await supabase.auth.signInWithPassword(form.data)

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return message(form, 'Invalid credentials')
      }
      return message(form, 'Server error. Try again later.', { status: 500 })
    }

    throw redirect(303, event.url.searchParams.get('redirectTo') || '/')
  },

  signout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut()
  },

  change_password: async (event) => {
    const form = await superValidate(event, changePasswordRefinedSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals
    const { error } = await supabase.auth.updateUser({
      password: form.data.password
    })

    if (error) {
      form.message = 'Failed to update password'
      return fail(400, { form })
    }

    // Sign out user to make them sign in with new password
    await supabase.auth.signOut()
    throw redirect(303, '/login')
  },

  reset_password: async (event) => {
    const form = await superValidate(event, emailSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals

    const { error } = await supabase.auth.resetPasswordForEmail(
      form.data.email,
      {
        redirectTo: `${event.url.origin}/auth/redirect?action=${redirects['password-reset'].action}`
      }
    )

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        form.errors.email = ['Email address not found']
        return fail(400, { form })
      }
      form.errors.email = ['Server error. Try again later.']
      return fail(500, { form })
    }

    return { form }
  },

  change_email: async (event) => {
    const form = await superValidate(event, emailSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals

    const { error } = await supabase.auth.updateUser(
      { email: form.data.email },
      {
        emailRedirectTo: `${event.url.origin}/auth/redirect?action=${redirects['email-change'].action}`
      }
    )

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        form.message = 'Email change failed'
        return fail(400, { form })
      }
      form.message = 'Server error. Try again later.'
      return fail(500, { form })
    }

    return { form }
  }
}
