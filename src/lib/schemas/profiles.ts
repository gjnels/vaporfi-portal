import { z } from 'zod'

const adminProfileSchema = z.object({
  name: z.string().trim(),
  role: z.enum(['Admin', 'Manager', 'Store']).nullable(),
  locations: z.record(z.boolean())
})

export const userIdSchema = z.object({
  id: z.string().trim().uuid()
})

export const adminUpdateProfileSchema = adminProfileSchema.merge(userIdSchema)

export const adminInviteUserSchema = adminProfileSchema.extend({
  email: z.string().trim().email()
})

export const profileNameSchema = z.object({
  name: z.string().trim()
})
