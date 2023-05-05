import { error, fail, redirect } from '@sveltejs/kit'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types.js'
import { message, superValidate } from 'sveltekit-superforms/server'
import { fixSkuSchema, skuIdSchema } from '$lib/schemas/skus'

const UPDATE_FORM_ID = 'update_missing_sku'
const DELETE_FORM_ID = 'delete_missing_sku'

export const load = async ({ locals: { supabase } }) => {
  const {
    data: skus,
    error: err,
    status
  } = await supabase
    .from('missing_skus')
    .select('*, submitted_from:locations(name), submitted_by:profiles(name, email)')
    .order('item_name')
    .returns<
      (DatabaseRow<'missing_skus'> & {
        submitted_from: Pick<DatabaseRow<'locations'>, 'name'> | null
        submitted_by: Pick<DatabaseRow<'profiles'>, 'name' | 'email'> | null
      })[]
    >()

  if (err) {
    throw error(status, 'Unable to fetch missing SKUs: ' + err.message)
  }

  return {
    skus,
    updateForm: superValidate(fixSkuSchema, { id: UPDATE_FORM_ID }),
    deleteForm: superValidate(skuIdSchema, { id: DELETE_FORM_ID })
  }
}

export const actions = {
  update: async ({ request, locals: { supabase } }) => {
    const form = await superValidate<typeof fixSkuSchema, Message>(request, fixSkuSchema, {
      id: UPDATE_FORM_ID
    })

    if (!form.valid) {
      return fail(400, { form })
    }

    const { error: err, status } = await supabase
      .from('missing_skus')
      .update({ fixed: form.data.fixed })
      .eq('id', form.data.id)
      .single()

    if (err) {
      return message(
        form,
        {
          type: 'error',
          message: 'Unable to update record: ' + err.message
        },
        { status }
      )
    }

    throw redirect(303, '/missing-sku/manage')
  },

  delete: async ({ request, locals: { supabase } }) => {
    const form = await superValidate<typeof skuIdSchema, Message>(request, skuIdSchema, {
      id: DELETE_FORM_ID
    })

    if (!form.valid) {
      return fail(400, { form })
    }

    const { error: err, status } = await supabase
      .from('missing_skus')
      .delete()
      .eq('id', form.data.id)
      .single()

    if (err) {
      return fail(status, {
        message: 'Unable to delete record: ' + err.message
      })
    }

    throw redirect(303, '/missing-sku/manage')
  }
}
