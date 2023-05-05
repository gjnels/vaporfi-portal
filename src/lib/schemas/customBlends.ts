import { type Refinement, z } from 'zod'

export const flavorPickerBlendSchema = z.object({
  flavor1: z
    .string({
      required_error: 'Choose a flavor',
      invalid_type_error: 'Not a valid flavor'
    })
    .trim()
    .min(1, 'Choose a flavor'),
  shots1: z.number().min(1, 'Cannot be less than 1').max(3, 'Cannot be more than 3').default(1),
  flavor2: z.string().trim(),
  shots2: z
    .number()
    .min(1, 'Cannot be less than 1')
    .max(2, 'Cannot be more than 2')
    .nullable()
    .default(null),
  flavor3: z.string().trim(),
  shots3: z
    .number()
    .min(1, 'Cannot be less than 1')
    .max(1, 'Cannot be more than 1')
    .nullable()
    .default(null)
})

export const flavorPickerSchema = flavorPickerBlendSchema.extend({
  id: z.string().cuid2().optional(),
  flavorCount: z.number().int().min(1).max(3).default(1),
  bottleCount: z
    .number({ required_error: 'Enter number of bottles' })
    .int({ message: 'Must be a whole number' })
    .min(1, 'Cannot be less than 1')
    .default(1),
  nicotine: z
    .number({ required_error: 'Enter nicotine level' })
    .min(0, 'Cannot be less than 0')
    .step(0.1, 'Cannot have more than 1 decimal place')
    .default(0)
})

// Used in form action on server to futher refine the schema
// Using this with sveltekit-superforms causes the inputs to error on page load
export const flavorPickerRefinedSchema = flavorPickerSchema.superRefine((data, ctx) => {
  if (data.shots2 && !data.flavor2) {
    ctx.addIssue({
      code: 'custom',
      message: 'Choose a flavor',
      path: ['flavor2']
    })
  }
  if (data.shots3 && !data.flavor3) {
    ctx.addIssue({
      code: 'custom',
      message: 'Choose a flavor',
      path: ['flavor3']
    })
  }
  if (data.flavor2 && data.flavor1 === data.flavor2) {
    ctx.addIssue({
      code: 'custom',
      message: 'Cannot choose the same flavor twice',
      path: ['flavor2']
    })
  }
  if (data.flavor3 && (data.flavor1 === data.flavor3 || data.flavor2 === data.flavor3)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Cannot choose the same flavor twice',
      path: ['flavor3']
    })
  }
  if (data.shots1 + (data?.shots2 || 0) + (data?.shots3 || 0) > 3) {
    ctx.addIssue({
      code: 'custom',
      message: 'Total number of shots cannot be more than 3',
      path: ['shots1']
    })
    data.shots2 &&
      ctx.addIssue({
        code: 'custom',
        message: 'Total number of shots cannot be more than 3',
        path: ['shots2']
      })
    data.shots3 &&
      ctx.addIssue({
        code: 'custom',
        message: 'Total number of shots cannot be more than 3',
        path: ['shots3']
      })
  }
})

export const savedFlavorPickerBlendSchema = flavorPickerSchema.extend({
  id: z.string().cuid2()
})

export const customBlendSchema = z.object({
  id: z.number().int().min(1),
  name: z.string().trim().min(1),
  flavorCount: z.number().int().min(1).max(3).default(1),
  flavor1_id: z.number().int().min(1, 'Choose a flavor'),
  flavor2_id: z.number().int().min(1).nullable().default(null),
  flavor3_id: z.number().int().min(1).nullable().default(null),
  shots1: z.number().min(1, 'Cannot be less than 1').max(3, 'Cannot be more than 3').default(1),
  shots2: z
    .number()
    .min(1, 'Cannot be less than 1')
    .max(2, 'Cannot be more than 2')
    .nullable()
    .default(null),
  shots3: z
    .number()
    .min(1, 'Cannot be less than 1')
    .max(1, 'Cannot be more than 1')
    .nullable()
    .default(null),
  approved: z.boolean().optional().default(false)
})

export const insertCustomBlendSchema = customBlendSchema.omit({
  id: true
})

export const updateCustomBlendSchema = customBlendSchema

const customBlendRefinement: Refinement<Omit<z.infer<typeof customBlendSchema>, 'id'>> = (
  data,
  ctx
) => {
  if (data.shots2 && !data.flavor2_id) {
    ctx.addIssue({
      code: 'custom',
      message: 'Choose a flavor',
      path: ['flavor2_id']
    })
  }
  if (data.shots3 && !data.flavor3_id) {
    ctx.addIssue({
      code: 'custom',
      message: 'Choose a flavor',
      path: ['flavor3_id']
    })
  }
  if (data.flavor2_id && data.flavor1_id === data.flavor2_id) {
    ctx.addIssue({
      code: 'custom',
      message: 'Cannot choose the same flavor twice',
      path: ['flavor2_id']
    })
  }
  if (
    data.flavor3_id &&
    (data.flavor1_id === data.flavor3_id || data.flavor2_id === data.flavor3_id)
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'Cannot choose the same flavor twice',
      path: ['flavor3_id']
    })
  }
  if (data.shots1 + (data?.shots2 || 0) + (data?.shots3 || 0) > 3) {
    ctx.addIssue({
      code: 'custom',
      message: 'Total number of shots cannot be more than 3',
      path: ['shots1']
    })
    data.shots2 &&
      ctx.addIssue({
        code: 'custom',
        message: 'Total number of shots cannot be more than 3',
        path: ['shots2']
      })
    data.shots3 &&
      ctx.addIssue({
        code: 'custom',
        message: 'Total number of shots cannot be more than 3',
        path: ['shots3']
      })
  }
}

export const customBlendRefinedSchema = customBlendSchema.superRefine(customBlendRefinement)

export const insertCustomBlendRefinedSchema =
  insertCustomBlendSchema.superRefine(customBlendRefinement)

export const updateCustomBlendRefinedSchema =
  updateCustomBlendSchema.superRefine(customBlendRefinement)

export const copyCustomBlendSchema = z.object({
  bottleCount: z.number().int().min(1).default(1),
  nicotine: z.number().min(0).step(0.1).default(0)
})

export const deleteCustomBlendSchema = updateCustomBlendSchema.pick({
  id: true
})
