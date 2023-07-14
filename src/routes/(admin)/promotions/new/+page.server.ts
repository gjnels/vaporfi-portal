import type { CustomBlend } from '$lib/types/flavors.types.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'
import { insertPromoSchema } from '$lib/schemas/promos'
import type { Actions, PageServerLoad } from './$types'
import { requireAuth } from '$lib/utils/auth'

export const load: PageServerLoad = async (event) => {
  await requireAuth({ event, roles: ['Admin'] })

  const {
    data: customBlends,
    error: err,
    status
  } = await event.locals.supabase
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

  if (err) {
    throw error(status, 'Unable to fetch custom blends: ' + err.message)
  }

  // User was redirected from creating a new custom blend
  // Select that newly created blend by default
  const param_blend_id = event.url.searchParams.get('blend_id')
  let custom_blend_id = 0
  if (param_blend_id) {
    const selected_blend_id = Number(param_blend_id)
    if (!isNaN(selected_blend_id) && customBlends.find(({ id }) => id === selected_blend_id)) {
      custom_blend_id = selected_blend_id
    }
  }

  return {
    form: superValidate({ custom_blend_id }, insertPromoSchema, { errors: false }),
    customBlends
  }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate<typeof insertPromoSchema, Message>(event, insertPromoSchema)
    if (!form.valid) {
      return fail(400, { form })
    }

    const { error, status } = await event.locals.supabase.from('promos').insert({
      ...form.data,
      custom_blend_id: form.data.custom_blend_id > 0 ? form.data.custom_blend_id : null,
      valid_from: form.data.valid_from.toISOString(),
      valid_until: form.data.valid_until.toISOString()
    })

    if (error) {
      // unique constraint error
      if (error.code === '23505') {
        return setError(form, 'title', 'A promotion with this title already exists')
      }
      return message(
        form,
        {
          type: 'error',
          message: ['Unable to create promotion.', error.message]
        },
        { status }
      )
    }

    throw redirect(303, '/promotions')
  }
}
