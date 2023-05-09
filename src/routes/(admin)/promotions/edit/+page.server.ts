import type { CustomBlend } from '$lib/types/flavors.types'
import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'
import { deletePromoSchema, updatePromoSchema } from '$lib/schemas/promos.js'

const UPDATE_FORM_ID = 'update_promo'
const DELETE_FORM_ID = 'delete_promo'

export const load = async ({ url: { searchParams }, locals: { supabase } }) => {
  const promoId = searchParams.get('promo_id')
  if (!promoId) {
    throw redirect(303, '/promotions')
  }

  const {
    data: promo,
    error: promosError,
    status: promoStatus
  } = await supabase.from('promos').select('*').eq('id', promoId).single()

  if (promosError) {
    throw error(promoStatus, 'Promotion not found: ' + promosError.message)
  }

  const {
    data: customBlends,
    error: customBlendsError,
    status: customBlendsStatus
  } = await supabase
    .from('custom_blends')
    .select('id, name, shots1, shots2, shots3, flavor1(flavor), flavor2(flavor), flavor3(flavor)')
    .is('approved', true)
    .order('name')
    .returns<
      Pick<
        CustomBlend,
        'id' | 'name' | 'shots1' | 'shots2' | 'shots3' | 'flavor1' | 'flavor2' | 'flavor3'
      >[]
    >()

  if (customBlendsError) {
    throw error(customBlendsStatus, 'Unable to fetch custom blends. Try again later.')
  }

  // User was redirected from creating a new custom blend
  // Select that newly created blend by default
  const param_blend_id = searchParams.get('blend_id')
  let custom_blend_id = promo.custom_blend_id || 0
  if (param_blend_id) {
    const selected_blend_id = Number(param_blend_id)
    if (!isNaN(selected_blend_id) && customBlends.find(({ id }) => id === selected_blend_id)) {
      custom_blend_id = selected_blend_id
    }
  }

  const foundPromo = {
    ...promo,
    custom_blend_id,
    valid_from: new Date(promo.valid_from),
    valid_until: new Date(promo.valid_until)
  }

  return {
    updateForm: superValidate(foundPromo, updatePromoSchema, { id: UPDATE_FORM_ID, errors: false }),
    deleteForm: superValidate(deletePromoSchema, { id: DELETE_FORM_ID }),
    promo: foundPromo,
    customBlends
  }
}

export const actions = {
  update: async (event) => {
    const form = await superValidate<typeof updatePromoSchema, Message>(event, updatePromoSchema, {
      id: UPDATE_FORM_ID
    })

    if (!form.valid) {
      return fail(400, { form })
    }

    const now = new Date()
    console.log(now)
    console.log(now.toLocaleString())
    console.log(now.toUTCString())
    console.log(now.toISOString())
    return

    const { error, status } = await event.locals.supabase
      .from('promos')
      .update({
        ...form.data,
        custom_blend_id: form.data.custom_blend_id > 0 ? form.data.custom_blend_id : null,
        valid_from: form.data.valid_from.toISOString(),
        valid_until: form.data.valid_until.toISOString()
      })
      .eq('id', form.data.id)

    if (error) {
      // unique constraint error
      if (error.code === '23505') {
        return setError(form, 'title', 'A promotion with this title already exists')
      }
      return message(
        form,
        {
          type: 'error',
          message: ['Unable to update promotion.', error.message]
        },
        { status }
      )
    }

    throw redirect(303, '/promotions')
  },

  delete: async ({ locals: { supabase }, request }) => {
    const form = await superValidate<typeof deletePromoSchema, Message>(
      request,
      deletePromoSchema,
      { id: DELETE_FORM_ID }
    )

    if (!form.valid) {
      return message(form, { type: 'error', message: 'Invalid promotion id' }, { status: 400 })
    }

    const { error, status } = await supabase
      .from('promos')
      .delete()
      .eq('id', form.data.id)
      .select()
      .single() // causes error if id cannot be found

    if (error) {
      return message(
        form,
        {
          type: 'error',
          message: 'Unable to delete promotion: ' + error.message
        },
        { status }
      )
    }

    throw redirect(303, '/promotions')
  }
}
