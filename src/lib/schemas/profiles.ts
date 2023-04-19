import { z } from 'zod'

const adminProfileSchema = z.object({
  name: z.string().trim().min(1).nullable().default(null),
  role: z.enum(['Admin', 'Manager', 'Store']).nullable(),
  locations: z.record(z.boolean())
})

export const adminUpdateProfileSchema = adminProfileSchema.extend({
  id: z.string().trim().uuid()
})

export const adminInviteUserSchema = adminProfileSchema.extend({
  email: z.string().trim().email()
})
