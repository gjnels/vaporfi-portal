import { z } from 'zod'

const adminProfileSchema = z.object({
  name: z.string().trim(),
  role: z.enum(['Admin', 'Manager', 'Store']).nullable(),
  locations: z.record(z.boolean())
})

export const adminUpdateProfileSchema = adminProfileSchema.extend({
  id: z.string().trim().uuid()
})

export const adminInviteUserSchema = adminProfileSchema.extend({
  email: z.string().trim().email()
})

export const profileSchema = z.object({
  id: z.string().trim().uuid(),
  name: z.string().trim().optional()
})
