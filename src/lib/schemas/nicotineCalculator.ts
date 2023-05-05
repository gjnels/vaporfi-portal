import { z } from 'zod'

const calculatorCommonSchema = z.object({
  bottleSize: z.number().positive().default(30),
  current: z
    .number({ required_error: 'Enter the current nicotine level' })
    .min(0, 'Current nicotine level cannot be less than 0')
    .step(0.1)
    .default(0)
})

// Use for validating nicotine calculator for calculating packets to get to a desired level
export const totalPacketsSchema = calculatorCommonSchema.extend({
  final: z
    .number({ required_error: 'Enter the nicotine level to get to' })
    .positive('Final nicotine level must be greater than zero')
    .step(0.1)
    .default(0),
  salt: z.boolean().optional().default(false)
})

export const totalPacketsRefinedSchema = totalPacketsSchema.refine(
  ({ final, current }) => final > current,
  {
    message: 'Final nicotine level must be greater than current nicotine level',
    path: ['final']
  }
)

export const nicotinePacketSchema = z.object({
  id: z.number().int().min(1),
  color: z.string().min(1),
  mg: z.number().int().min(1),
  salt: z.boolean()
})

export const savedNicotinePacketSchema = nicotinePacketSchema.extend({
  available: z.boolean().default(true)
})

// Used for validating nicotine calculator for calculating total nicotine level depending on selected packets to add
export const totalNicotineSchema = calculatorCommonSchema.extend({
  packets: nicotinePacketSchema
    .extend({
      selected: z.boolean().default(false),
      count: z.number().int().min(1, 'You must have at least one packet').default(1)
    })
    .omit({ salt: true })
    .array()
})
