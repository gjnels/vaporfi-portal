import { fail } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

import type { Actions, PageServerLoad } from './$types'

import { totalNicotineSchema } from '$lib/schemas/nicotineCalculator'

export const load = (async ({ parent }) => {
  const { packets } = await parent()
  return {
    form: superValidate(
      {
        packets: packets.map((packet) => ({
          ...packet,
          count: 1,
          selected: false
        }))
      },
      totalNicotineSchema
    )
  }
}) satisfies PageServerLoad

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, totalNicotineSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    // No packets selected
    if (form.data.packets.filter((packet) => packet.selected).length === 0) {
      return message(form, 'You must select at least one packet to add')
    }
    return { form }
  }
} satisfies Actions
