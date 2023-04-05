import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

// Use advanced formatting for orthoganl dates
// i.e. January 1st instead of January 1
dayjs.extend(advancedFormat)

export const formatPromoDate = (date: Date | string) =>
  dayjs(date).format('h:mma dddd, MMMM Do, YYYY')
