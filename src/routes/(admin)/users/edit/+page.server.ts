import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { error, fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

import {
  adminUpdateProfileSchema,
  userIdSchema
} from '$lib/schemas/profiles.js'

export const load = async ({
  locals: { supabase },
  url: { searchParams },
  parent
}) => {
  const id = searchParams.get('profile_id')
  if (!id) {
    throw redirect(303, '/users')
  }

  // prevent user from accessing this edit page for their own account
  const { session } = await parent()
  if (session.user.id === id) {
    throw redirect(303, '/users')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, locations(id)')
    .eq('id', id)
    .single()

  if (profileError) {
    throw redirect(303, '/users')
  }

  const {
    data: locations,
    error: locationsError,
    status: locationsStatus
  } = await supabase.from('locations').select('id, name').order('name')

  if (locationsError) {
    throw error(
      locationsStatus,
      'Unable to fetch locations: ' + locationsError.message
    )
  }

  const hasLocation = (id: number) => {
    if (!profile.locations) {
      return false
    }
    if (Array.isArray(profile.locations)) {
      return profile.locations.findIndex((l) => l.id === id) >= 0
    }
    return profile.locations.id === id
  }

  const locationsObject: Record<number, boolean> = {}
  locations.forEach((location) => {
    locationsObject[location.id] = hasLocation(location.id)
  })

  return {
    profile,
    locations,
    updateForm: superValidate<typeof adminUpdateProfileSchema, Message>(
      { ...profile, locations: locationsObject },
      adminUpdateProfileSchema,
      { id: 'editUserForm' }
    ),
    deleteForm: superValidate<typeof userIdSchema, Message>(
      { id },
      userIdSchema,
      { id: 'deleteUserForm' }
    )
  }
}

export const actions = {
  updateUser: async (event) => {
    const form = await superValidate<typeof adminUpdateProfileSchema, Message>(
      event,
      adminUpdateProfileSchema,
      { id: 'editUserForm' }
    )

    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals
    const { id: profileId, name, role, locations } = form.data

    const { error: updateProfileError, status } = await supabase
      .from('profiles')
      .update({ name, role })
      .eq('id', profileId)

    if (updateProfileError) {
      return message(
        form,
        {
          type: 'error',
          message: [
            'Unable to update user profile.',
            updateProfileError.message
          ]
        },
        { status }
      )
    }

    for (const locationId in locations) {
      if (locations[locationId]) {
        // Insert or update location
        const { error: err, status } = await supabase
          .from('profiles_locations')
          .upsert(
            { location_id: Number(locationId), profile_id: profileId },
            { onConflict: 'location_id, profile_id' }
          )
        if (err) {
          return message(
            form,
            {
              type: 'error',
              message: ['Unable to modify user locations.', err.message]
            },
            { status }
          )
        }
      } else {
        // Delete location
        const { error: err, status } = await supabase
          .from('profiles_locations')
          .delete()
          .eq('location_id', Number(locationId))
          .eq('profile_id', profileId)
        if (err) {
          return message(
            form,
            {
              type: 'error',
              message: ['Unable to modify user locations.', err.message]
            },
            { status }
          )
        }
      }
    }

    // on successful updates, go back to all users page
    throw redirect(303, '/users')
  },

  deleteUser: async (event) => {
    const form = await superValidate<typeof userIdSchema, Message>(
      event,
      userIdSchema,
      { id: 'deleteUserForm' }
    )
    if (!form.valid) {
      return message(
        form,
        { type: 'error', message: 'Invalid user id' },
        { status: 400 }
      )
    }

    const supabaseAdminClient = createSupabaseServerClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: SUPABASE_SERVICE_ROLE_KEY,
      event
    })

    const { error } = await supabaseAdminClient.auth.admin.deleteUser(
      form.data.id
    )
    if (error) {
      return message(
        form,
        {
          type: 'error',
          message: ['Unable to delete user', error.message]
        },
        { status: error.status ?? 500 }
      )
    }

    throw redirect(303, '/users')
  }
}
