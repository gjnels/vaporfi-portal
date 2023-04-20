import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

import { profileNameSchema } from '$lib/schemas/profiles.js'

export const load = async ({ locals: { supabase }, parent, url }) => {
  const { session } = await parent()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    await supabase.auth.signOut()
    throw redirect(307, `/login?redirectTo=${url.pathname}${url.search}`)
  }

  return {
    profile,
    form: superValidate<typeof profileNameSchema, Message>(
      { name: profile.name },
      profileNameSchema
    )
  }
}

export const actions = {
  updateName: async (event) => {
    const form = await superValidate<typeof profileNameSchema, Message>(
      event,
      profileNameSchema
    )
    if (!form.valid) {
      return fail(400, { form })
    }

    const session = await event.locals.getSession()
    if (!session) {
      throw error(401) // Unauthenticated
    }

    const { error: err, status } = await event.locals.supabase
      .from('profiles')
      .update(form.data)
      .eq('id', session.user.id)
      .single()

    if (err) {
      return setError(form, 'name', err.message, { status })
    }

    return message(
      form,
      {
        type: 'success',
        message: 'Your name has been updated.'
      },
      { status: 200 }
    )
  }
}
