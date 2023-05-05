import { z } from 'zod'

const skuSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, 'Enter the SKU that needs to be added')
    .regex(/^[0-9]+$/, 'Enter a valid SKU'),
  fixed: z.boolean().default(false).optional(),
  submitted_from_location_id: z
    .number()
    .positive('You must choose your current location')
    .default(-1),
  submitted_by_profile_id: z.string().trim().uuid().optional(),
  submitted_by_name: z.string().trim().optional(),
  notes: z.string().trim().optional()
})

export const missingSkuSchema = skuSchema.extend({
  item_name: z.string().trim().min(1, 'Enter the item name')
})

export const incorrectSkuSchema = skuSchema.extend({
  correct_item_name: z.string().trim().min(1, 'Enter the name of the item this SKU belongs to'),
  incorrect_item_name: z
    .string()
    .trim()
    .min(1, 'Enter the name of the item that is currently ringing up')
})

export const incorrectSkuRefinedSchema = incorrectSkuSchema.superRefine((data, ctx) => {
  if (data.incorrect_item_name === data.correct_item_name) {
    ctx.addIssue({
      code: 'custom',
      message: 'Item names cannot be the same',
      path: ['incorrect_item_name']
    })
    ctx.addIssue({
      code: 'custom',
      message: 'Item names cannot be the same',
      path: ['correct_item_name']
    })
  }
})

export const skuIdSchema = z.object({
  id: z.number().positive()
})

export const updateMissingSkuSchema = missingSkuSchema.merge(skuIdSchema)
export const updateIncorrectSkuSchema = incorrectSkuSchema.merge(skuIdSchema)

export const fixSkuSchema = skuIdSchema.merge(
  z.object({
    fixed: z.boolean()
  })
)
