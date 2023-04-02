import type { Blend } from '$lib/types/flavors.types'
import type { DatabaseRow } from '$lib/types/supabaseHelpers.types'

type BlendFlavors = Omit<Blend, 'name'>

export const categoriesFromFlavors = (flavors: DatabaseRow<'flavors'>[]) =>
  Array.from(new Set(flavors.map((flavor) => flavor.category)))

const blendFlavorsToArray = (data: BlendFlavors) => {
  const blend = [
    {
      flavor:
        typeof data.flavor1 === 'string' ? data.flavor1 : data.flavor1.flavor,
      shots: data.shots1
    }
  ]

  if (data.shots2 && data.flavor2) {
    blend.push({
      flavor:
        typeof data.flavor2 === 'string' ? data.flavor2 : data.flavor2.flavor,
      shots: data.shots2
    })
  }

  if (data.shots3 && data.flavor3) {
    blend.push({
      flavor:
        typeof data.flavor3 === 'string' ? data.flavor3 : data.flavor3.flavor,
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

export const createBlendString = (
  mix: Blend & { bottleCount: number; nicotine: number }
) => {
  return `${mix.bottleCount} x ${mix.nicotine}mg ${
    mix.name ? `${mix.name} ` : ''
  }(${blendFlavorsToArray(mix)
    .map(({ flavor, shots }) => `${shots} ${flavor}`)
    .join(' - ')})`
}
