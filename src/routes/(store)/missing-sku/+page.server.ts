import { error, fail } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import type { z } from 'zod'

import { missingSkuSchema } from '$lib/schemas/skus'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
  const {
    data: locations,
    error: locationsError,
    status: locationsStatus
  } = await supabase.from('locations').select('id, name')

  if (locationsError) {
    throw error(locationsStatus, 'Unable to fetch locations: ' + locationsError.message)
  }

  const {
    data: missingSkus,
    error: missingSkusError,
    status: missingskusStatus
  } = await supabase.from('missing_skus').select('*').eq('fixed', false)

  if (missingSkusError) {
    throw error(
      missingskusStatus,
      'Unable to fetch pending missing skus: ' + missingSkusError.message
    )
  }

  // If the currently logged in user is assigned to a single location, this will be set as the default submitted_from_id
  const session = await getSession()
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*, locations(id, name)')
    .eq('id', session?.user.id)
    .single()

  const getDefaultValues = () => {
    // form will be blank without
    if (!currentProfile) {
      return null
    }

    const values: Partial<z.infer<typeof missingSkuSchema>> = {
      submitted_by_profile_id: currentProfile.id
    }

    if (currentProfile.name) {
      values.submitted_by_name = currentProfile.name
    }

    if (currentProfile.locations) {
      if (Array.isArray(currentProfile.locations)) {
        if (currentProfile.locations.length === 1) {
          values.submitted_from_location_id = currentProfile.locations[0].id
        }
      } else {
        values.submitted_from_location_id = currentProfile.locations.id
      }
    }

    return values
  }

  return {
    form: superValidate<typeof missingSkuSchema, Message>(getDefaultValues(), missingSkuSchema, {
      noErrors: true
    }),
    locations,
    pendingItems: missingSkus
  }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate<typeof missingSkuSchema, Message>(event, missingSkuSchema)
    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals

    const { error, status } = await supabase.from('missing_skus').insert(form.data)

    if (error) {
      if (error.code === '23505') {
        // duplicate unique values
        return message(
          form,
          {
            type: 'error',
            message: 'There is already an entry for this item and SKU'
          },
          { status }
        )
      }
      return message(
        form,
        {
          type: 'error',
          message: 'Unable to submit missing SKU: ' + error.message
        },
        { status }
      )
    }

    return { form }
  }
}
