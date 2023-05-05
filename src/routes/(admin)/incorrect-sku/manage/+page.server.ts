import type { DatabaseRow } from '$lib/types/supabaseHelpers.types.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/client'
import { fixSkuSchema, skuIdSchema } from '$lib/schemas/skus.js'

const UPDATE_FORM_ID = 'update_incorrect_sku'
const DELETE_FORM_ID = 'delete_incorrect_sku'

export const load = async ({ locals: { supabase } }) => {
  const {
    data: skus,
    error: err,
    status
  } = await supabase
    .from('incorrect_skus')
    .select('*, submitted_from:locations(name), submitted_by:profiles(name, email)')
    .order('correct_item_name')
    .order('incorrect_item_name')
    .returns<
      (DatabaseRow<'incorrect_skus'> & {
        submitted_from: Pick<DatabaseRow<'locations'>, 'name'> | null
        submitted_by: Pick<DatabaseRow<'profiles'>, 'name' | 'email'> | null
      })[]
    >()

  if (err) {
    throw error(status, 'Unable to fetch incorrect SKUs: ' + err.message)
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
      .from('incorrect_skus')
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

    throw redirect(303, '/incorrect-sku/manage')
  },

  delete: async ({ request, locals: { supabase } }) => {
    const form = await superValidate<typeof skuIdSchema, Message>(request, skuIdSchema, {
      id: DELETE_FORM_ID
    })

    if (!form.valid) {
      return fail(400, { form })
    }

    const { error: err, status } = await supabase
      .from('incorrect_skus')
      .delete()
      .eq('id', form.data.id)
      .single()

    if (err) {
      return fail(status, {
        message: 'Unable to delete record: ' + err.message
      })
    }

    throw redirect(303, '/incorrect-sku/manage')
  }
}
