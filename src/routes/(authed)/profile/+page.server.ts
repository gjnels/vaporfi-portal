import { error, fail } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms/server'

import { profileNameSchema } from '$lib/schemas/profiles.js'
import type { Actions, PageServerLoad } from './$types'
import { requireAuth } from '$lib/utils/auth'

export const load: PageServerLoad = async (event) => {
  const { user } = await requireAuth({ event, returnUser: true })

  return {
    profile: user,
    nameForm: superValidate<typeof profileNameSchema, Message>(
      { name: user.name },
      profileNameSchema,
      { id: 'name_form' }
    )
  }
}

export const actions: Actions = {
  updateName: async (event) => {
    const form = await superValidate<typeof profileNameSchema, Message>(event, profileNameSchema, {
      id: 'name_form'
    })
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

    return { form }
  }
}
