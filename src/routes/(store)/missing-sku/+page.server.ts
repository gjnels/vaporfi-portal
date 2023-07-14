import type { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import { missingSkuSchema } from '$lib/schemas/skus'
import { requireAuth } from '$lib/utils/auth'

export const load: PageServerLoad = async (event) => {
  const { user } = await requireAuth({
    event,
    roles: ['Store', 'Manager', 'Admin'],
    returnUser: true
  })

  const editSkuId = event.url.searchParams.get('editId')

  const { supabase } = event.locals

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
  } = await supabase
    .from('missing_skus')
    .select('*, location:submitted_from_location_id(name)')
    .eq('fixed', false)

  if (missingSkusError) {
    throw error(
      missingskusStatus,
      'Unable to fetch pending missing skus: ' + missingSkusError.message
    )
  }

  const getDefaultValues = () => {
    const values: Partial<z.infer<typeof missingSkuSchema>> = {
      submitted_by_profile_id: user.id
    }

    if (editSkuId) {
      const id = parseInt(editSkuId)
      if (isNaN(id)) {
        throw redirect(303, '/missing-sku')
      }
      const missing = missingSkus.find((m) => m.id === id)
      if (!missing || user.id !== missing.submitted_by_profile_id) {
        throw redirect(303, '/missing-sku')
      }
      values.item_name = missing.item_name
      values.sku = missing.sku
      values.submitted_by_name = missing.submitted_by_name
      values.submitted_from_location_id = missing.submitted_from_location_id
      values.notes = missing.notes
      values.id = missing.id
    }

    // Set the name to the current user's name if they have one and if this user is not a Store
    // If user is a Store, it could be any user submitting a sku, so leave the name blank
    if (user.role !== 'Store' && user.name) {
      values.submitted_by_name = user.name
    }

    // If the currently logged in user is assigned to a single location, this will be set as the default submitted_from_id
    if (user.locations) {
      // locations may be returned as an array
      if (Array.isArray(user.locations)) {
        if (user.locations.length === 1) {
          values.submitted_from_location_id = user.locations[0].id
        }
      } else {
        values.submitted_from_location_id = user.locations.id
      }
    }

    return values
  }

  return {
    form: superValidate<typeof missingSkuSchema, Message>(getDefaultValues(), missingSkuSchema, {
      noErrors: true
    }),
    currentProfile: user,
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
