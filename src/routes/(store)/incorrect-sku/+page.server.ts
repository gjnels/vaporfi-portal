import type { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { error, fail } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'
import { incorrectSkuRefinedSchema, incorrectSkuSchema } from '$lib/schemas/skus'
import { requireAuth } from '$lib/utils/auth'

export const load: PageServerLoad = async (event) => {
  const { user } = await requireAuth({
    event,
    roles: ['Store', 'Manager', 'Admin'],
    returnUser: true
  })

  const { supabase } = event.locals

  const {
    data: locations,
    error: locationsError,
    status: locationsStatus
  } = await supabase.from('locations').select('id, name').order('name')

  if (locationsError) {
    throw error(locationsStatus, 'Unable to fetch locations: ' + locationsError.message)
  }

  const {
    data: incorrectSkus,
    error: incorrectSkusError,
    status: incorrectskusStatus
  } = await supabase
    .from('incorrect_skus')
    .select('*')
    .eq('fixed', false)
    .order('incorrect_item_name')
    .order('correct_item_name')

  if (incorrectSkusError) {
    throw error(
      incorrectskusStatus,
      'Unable to fetch pending incorrect skus: ' + incorrectSkusError.message
    )
  }

  const getDefaultValues = () => {
    const values: Partial<z.infer<typeof incorrectSkuSchema>> = {
      submitted_by_profile_id: user.id
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
    form: superValidate<typeof incorrectSkuSchema, Message>(
      getDefaultValues(),
      incorrectSkuSchema,
      { noErrors: true }
    ),
    locations,
    pendingItems: incorrectSkus
  }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate<typeof incorrectSkuRefinedSchema, Message>(
      event,
      incorrectSkuRefinedSchema
    )
    if (!form.valid) {
      return fail(400, { form })
    }

    const { supabase } = event.locals

    const { error, status } = await supabase.from('incorrect_skus').insert(form.data)

    if (error) {
      if (error.code === '23505') {
        // duplicate unique values
        return message(
          form,
          {
            type: 'error',
            message: 'There is already an entry for these items and SKU'
          },
          { status }
        )
      }
      if (error.code === '23514') {
        // constraint violation
        if (error.message.includes('different_items')) {
          setError(form, 'incorrect_item_name', 'Item names cannot be the same.')
          return setError(form, 'correct_item_name', 'Item names cannot be the same.')
        }
      }
      return message(
        form,
        {
          type: 'error',
          message: 'Unable to submit incorrect SKU: ' + error.message
        },
        { status }
      )
    }

    return { form }
  }
}
