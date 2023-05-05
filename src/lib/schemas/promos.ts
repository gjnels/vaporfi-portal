import { type Refinement, z } from 'zod'

const promoSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().nullable().default(null),
  custom_blend_id: z.number().int(),
  sale: z.string().trim().min(1),
  details: z.string().trim().nullable().default(null),
  notes: z.string().trim().nullable().default(null),
  valid_from: z.date(),
  valid_until: z.date()
})

const promoIdSchema = z.object({ id: z.number().int().positive() })

const promoRefinement: Refinement<Omit<z.infer<typeof promoSchema>, 'id'>> = (data, ctx) => {
  if (data.valid_from >= data.valid_until) {
    ctx.addIssue({
      code: 'custom',
      message: 'Ending date must come after starting date',
      path: ['valid_until']
    })
  }
}

export const insertPromoSchema = promoSchema.superRefine(promoRefinement)
// export const refinedInsertPromoSchema = insertPromoSchema.superRefine(promoRefinement)
export const updatePromoSchema = promoSchema.merge(promoIdSchema).superRefine(promoRefinement)
// export const refinedUpdatePromoSchema = updatePromoSchema.superRefine(promoRefinement)
export const deletePromoSchema = promoIdSchema
