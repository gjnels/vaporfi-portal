import { type Refinement, z } from 'zod'

export const promoSchema = z.object({
  id: z.number().int().min(1),
  title: z.string().trim().min(1),
  subtitle: z.string().trim().nullable().default(null),
  custom_blend_id: z.number().int().min(1).nullable().default(null),
  sale: z.string().trim().min(1),
  details: z.string().trim().nullable().default(null),
  notes: z.string().trim().nullable().default(null),
  valid_from: z.date(),
  valid_until: z.date()
})

export const promoInsertSchema = promoSchema.omit({ id: true })

const promoRefinement: Refinement<Omit<z.infer<typeof promoSchema>, 'id'>> = (
  data,
  ctx
) => {
  if (data.valid_from >= data.valid_until) {
    ctx.addIssue({
      code: 'custom',
      message: 'Ending date must come after starting date',
      path: ['valid_until']
    })
  }
}

export const refinedPromoSchema = promoSchema.superRefine(promoRefinement)

export const refinedInsertPromoSchema =
  promoInsertSchema.superRefine(promoRefinement)
