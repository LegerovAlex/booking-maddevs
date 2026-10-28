import dayjs from 'dayjs'
import * as yup from 'yup'
import { validateBooking } from '@/entities/booking'
import type { Booking } from '@/entities/booking'

const TITLE_MAX_LENGTH = 100

type BookingSchemaContext = {
  bookings: Booking[]
  excludeId?: string
}

export const createBookingSchema = ({ bookings, excludeId }: BookingSchemaContext) =>
  yup
    .object({
      title: yup
        .string()
        .trim()
        .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),
      date: yup.string().required('Select a date'),
      start: yup.string().required('Select start time'),
      end: yup.string().required('Select end time'),
    })
    .test('booking-rules', ({ date, start, end }, context) => {
      if (!date || !start || !end) return true

      const error = validateBooking({ date, start, end }, { bookings, now: dayjs(), excludeId })
      if (!error) return true

      const path = error.field === 'date' ? 'start' : error.field

      return context.createError({ path, message: error.message })
    })

export type BookingFormValues = yup.InferType<ReturnType<typeof createBookingSchema>>
