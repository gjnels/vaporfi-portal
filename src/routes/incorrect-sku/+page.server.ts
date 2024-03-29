import { error, fail } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'
import type { z } from 'zod'

import { incorrectSkuRefinedSchema, incorrectSkuSchema } from '$lib/schemas/skus'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
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

    const values: Partial<z.infer<typeof incorrectSkuSchema>> = {
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
