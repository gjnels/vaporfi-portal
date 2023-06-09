import { error, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { copyCustomBlendSchema } from '$lib/schemas/customBlends.js'
import type { CustomBlend } from '$lib/types/flavors.types.js'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const {
    data: blends,
    error: err,
    status
  } = await supabase
    .from('custom_blends')
    .select('*, flavor1(*), flavor2(*), flavor3(*)')
    // show unapproved blends first, then sort by name
    .order('approved')
    .order('name')
    .returns<CustomBlend[]>()

  if (err) {
    throw error(status, 'Unable to fetch custom blends. ' + err.message)
  }

  return {
    blends,
    form: superValidate(copyCustomBlendSchema, { id: 'copy_blend' })
  }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, copyCustomBlendSchema, { id: 'copy_blend' })
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  }
}
