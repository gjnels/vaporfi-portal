import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, { message: 'Password is required' })
})

export const changePasswordSchema = z.object({
  password: z
    .string({ required_error: 'Enter your new password' })
    .trim()
    .min(8, { message: 'Password must be 8 or more characters' })
    .max(64, { message: 'Password cannot be more than 64 characters' }),
  passwordConfirm: z
    .string({ required_error: 'Confirm your new password' })
    .trim()
    .min(8, { message: 'Password must be 8 or more characters' })
    .max(64, { message: 'Password cannot be more than 64 characters' })
})

export const changePasswordRefinedSchema = changePasswordSchema.superRefine(
  ({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['passwordConfirm']
      })
    }
  }
)

export const emailSchema = loginSchema.omit({ password: true })
