import type { Blend } from '$lib/types/flavors'

const blendFlavorToArray = (data: Blend) => {
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

export const createDisplayBlendString = (blend: Blend) => {
  return blendFlavorToArray(blend)
    .map(({ flavor, shots }) => `${shots} ${flavor}`)
    .join(' - ')
}
