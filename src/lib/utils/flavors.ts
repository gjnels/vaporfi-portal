import type {
  flavorPickerSchema,
  insertCustomBlendSchema,
  updateCustomBlendSchema
} from '$lib/schemas/customBlends'
import type { Blend } from '$lib/types/flavors.types'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'
import type { z } from 'zod'

type BlendFlavors = Omit<Blend, 'name'>

export const categoriesFromFlavors = (flavors: DatabaseRow<'flavors'>[]) =>
  Array.from(new Set(flavors.map((flavor) => flavor.category)))

const blendFlavorsToArray = (data: BlendFlavors) => {
  const blend = [
    {
      flavor: typeof data.flavor1 === 'string' ? data.flavor1 : data.flavor1.flavor,
      shots: data.shots1
    }
  ]

  if (data.shots2 && data.flavor2) {
    blend.push({
      flavor: typeof data.flavor2 === 'string' ? data.flavor2 : data.flavor2.flavor,
      shots: data.shots2
    })
  }

  if (data.shots3 && data.flavor3) {
    blend.push({
      flavor: typeof data.flavor3 === 'string' ? data.flavor3 : data.flavor3.flavor,
      shots: data.shots3
    })
  }

  return blend
}

export const createDisplayBlendString = (blend: BlendFlavors) => {
  return blendFlavorsToArray(blend)
    .map(({ flavor, shots }) => `${shots} ${flavor}`)
    .join(' - ')
}

export const createBlendString = (mix: Blend & { bottleCount: number; nicotine: number }) => {
  return `${mix.bottleCount} x ${mix.nicotine}mg ${
    mix.name ? `${mix.name} ` : ''
  }(${blendFlavorsToArray(mix)
    .map(({ flavor, shots }) => `${shots} ${flavor}`)
    .join(' - ')})`
}

// Prevent already chosen flavors from showing as options for other inputs
// Each set of options will filter out options that are selected in other groups
// Values will be the flavor names
export const setFlavorPickerFlavorOptions = (
  form: z.infer<typeof flavorPickerSchema>,
  flavors: DatabaseRow<'flavors'>[]
) => {
  return {
    flavor1Options: flavors
      .filter(({ flavor }) => flavor !== form.flavor2 && flavor !== form.flavor3)
      .map((f) => ({
        value: f.flavor,
        label: f.flavor,
        group: f.category
      })),
    flavor2Options: flavors
      .filter(({ flavor }) => flavor !== form.flavor1 && flavor !== form.flavor3)
      .map((f) => ({
        value: f.flavor,
        label: f.flavor,
        group: f.category
      })),
    flavor3Options: flavors
      .filter(({ flavor }) => flavor !== form.flavor1 && flavor !== form.flavor2)
      .map((f) => ({
        value: f.flavor,
        label: f.flavor,
        group: f.category
      }))
  }
}

// Prevent already chosen flavors from showing as options for other inputs
// Each set of options will filter out options that are selected in other groups
// Values will be the flavor ids
export const setCustomBlendFlavorOptions = (
  form: z.infer<typeof insertCustomBlendSchema | typeof updateCustomBlendSchema>,
  flavors: DatabaseRow<'flavors'>[]
) => {
  return {
    flavor1Options: flavors
      .filter(({ id }) => id !== form.flavor2_id && id !== form.flavor3_id)
      .map((f) => ({
        value: f.id,
        label: f.flavor,
        group: f.category
      })),
    flavor2Options: flavors
      .filter(({ id }) => id !== form.flavor1_id && id !== form.flavor3_id)
      .map((f) => ({
        value: f.id,
        label: f.flavor,
        group: f.category
      })),
    flavor3Options: flavors
      .filter(({ id }) => id !== form.flavor1_id && id !== form.flavor2_id)
      .map((f) => ({
        value: f.id,
        label: f.flavor,
        group: f.category
      }))
  }
}

// Flavor values and shot values depend on the number of flavors
export const setBlendFormValues = <
  T extends z.infer<
    typeof flavorPickerSchema | typeof insertCustomBlendSchema | typeof updateCustomBlendSchema
  >
>(
  form: T
): T => {
  switch (form.flavorCount) {
    case 1:
      if ('nicotine' in form) {
        // flavor picker form
        form.flavor2 = ''
        form.flavor3 = ''
        form.shots2 = null
        form.shots3 = null
      } else {
        // custom blend form
        form.flavor2_id = null
        form.flavor3_id = null
        form.shots2 = null
        form.shots3 = null
      }
      break
    case 2:
      if (form.shots2 === 2) {
        form.shots1 = 1
      } else if (form.shots1 >= 2) {
        form.shots1 = 2
        form.shots2 = 1
      } else {
        form.shots2 = 1
      }
      if ('nicotine' in form) {
        // flavor picker form
        form.flavor3 = ''
        form.shots3 = null
      } else {
        // custom blend form
        form.flavor3_id = null
        form.shots3 = null
      }
      break
    case 3:
      form.shots1 = form.shots2 = form.shots3 = 1
      break
  }

  return form
}
