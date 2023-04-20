import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { error, fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

import { adminInviteUserSchema } from '$lib/schemas/profiles'

export const load = async ({ locals: { supabase } }) => {
  const {
    data: locations,
    error: err,
    status
  } = await supabase.from('locations').select('id, name').order('name')

  if (err) {
    throw error(status, 'Unable to fetch locations: ' + err.message)
  }

  return {
    locations,
    form: superValidate<typeof adminInviteUserSchema, Message>(
      null,
      adminInviteUserSchema
    )
  }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate<typeof adminInviteUserSchema, Message>(
      event,
      adminInviteUserSchema
    )

    if (!form.valid) {
      return fail(400, { form })
    }

    const supabaseAdminClient = createSupabaseServerClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: SUPABASE_SERVICE_ROLE_KEY,
      event
    })

    const { data, error: inviteError } =
      await supabaseAdminClient.auth.admin.inviteUserByEmail(form.data.email, {
        redirectTo: `${event.url.origin}/auth/redirect?action=accept-invite`
      })

    if (inviteError) {
      return message(
        form,
        {
          type: 'error',
          message: ['Unable to invite user.', inviteError.message]
        },
        { status: inviteError.status }
      )
    }

    const { supabase } = event.locals
    const { name, role, locations } = form.data
    const { user } = data

    // profile has already been created from a trigger on the insert on auth.users table
    const { error: updateProfileError, status: updateProfileStatus } =
      await supabase.from('profiles').update({ name, role }).eq('id', user.id)

    if (updateProfileError) {
      return message(
        form,
        {
          type: 'error',
          message: [
            'User has been invited. Unable to add user details.',
            updateProfileError.message
          ]
        },
        { status: updateProfileStatus }
      )
    }

    const locationsToAdd: { location_id: number; profile_id: string }[] = []
    for (const locationId in locations) {
      if (locations[locationId]) {
        locationsToAdd.push({
          location_id: Number(locationId),
          profile_id: user.id
        })
      }
    }

    if (locationsToAdd.length > 0) {
      const { error: insertLocationsError, status } = await supabase
        .from('profiles_locations')
        .insert(locationsToAdd)

      if (insertLocationsError) {
        return message(
          form,
          {
            type: 'error',
            message: [
              "User has been invited. Unable to add user's locations.",
              insertLocationsError.message
            ]
          },
          { status }
        )
      }
    }

    throw redirect(303, '/users')
  }
}
