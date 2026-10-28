import dayjs, { type Dayjs } from 'dayjs'
import { isValidDate, isValidTime, timeToMinutes } from '@/shared/lib/time'
import { BOOKING_CONFIG } from '../config/constants'
import type { Booking } from '../model/types'
import { isOverlapping } from './overlap'

export type BookingValidationCode =
  | 'INVALID_FORMAT'
  | 'OUTSIDE_WORKING_DAY'
  | 'START_NOT_BEFORE_END'
  | 'NOT_ALIGNED_TO_STEP'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'PAST_DATE'
  | 'PAST_TIME'
  | 'OVERLAP'

export type BookingValidationError = {
  code: BookingValidationCode
  field: 'date' | 'start' | 'end'
  message: string
}

type BookingSlot = {
  date: string
  start: string
  end: string
}

type ValidationContext = {
  bookings: Booking[]
  now: Dayjs
  excludeId?: string
}

export const validateBooking = (
  slot: BookingSlot,
  { bookings, now, excludeId }: ValidationContext,
): BookingValidationError | null => {
  const { date, start, end } = slot
  const {
    workingDayStart,
    workingDayEnd,
    timeStepMinutes,
    minDurationMinutes,
    maxDurationMinutes,
  } = BOOKING_CONFIG

  if (!isValidDate(date)) {
    return { code: 'INVALID_FORMAT', field: 'date', message: 'Date must be in YYYY-MM-DD format' }
  }
  if (!isValidTime(start)) {
    return { code: 'INVALID_FORMAT', field: 'start', message: 'Start must be in HH:mm format' }
  }
  if (!isValidTime(end)) {
    return { code: 'INVALID_FORMAT', field: 'end', message: 'End must be in HH:mm format' }
  }

  const startMinutes = timeToMinutes(start)
  const endMinutes = timeToMinutes(end)
  const duration = endMinutes - startMinutes

  if (startMinutes < timeToMinutes(workingDayStart)) {
    return {
      code: 'OUTSIDE_WORKING_DAY',
      field: 'start',
      message: `Start cannot be earlier than ${workingDayStart}`,
    }
  }
  if (endMinutes > timeToMinutes(workingDayEnd)) {
    return {
      code: 'OUTSIDE_WORKING_DAY',
      field: 'end',
      message: `End cannot be later than ${workingDayEnd}`,
    }
  }

  if (startMinutes >= endMinutes) {
    return { code: 'START_NOT_BEFORE_END', field: 'end', message: 'End must be after start' }
  }

  if (startMinutes % timeStepMinutes !== 0) {
    return {
      code: 'NOT_ALIGNED_TO_STEP',
      field: 'start',
      message: `Start must be a multiple of ${timeStepMinutes} minutes`,
    }
  }
  if (endMinutes % timeStepMinutes !== 0) {
    return {
      code: 'NOT_ALIGNED_TO_STEP',
      field: 'end',
      message: `End must be a multiple of ${timeStepMinutes} minutes`,
    }
  }

  if (duration < minDurationMinutes) {
    return {
      code: 'TOO_SHORT',
      field: 'end',
      message: `Minimum duration is ${minDurationMinutes} minutes`,
    }
  }
  if (duration > maxDurationMinutes) {
    return {
      code: 'TOO_LONG',
      field: 'end',
      message: `Maximum duration is ${maxDurationMinutes / 60} hours`,
    }
  }

  const bookingDate = dayjs(date)
  if (bookingDate.isBefore(now, 'day')) {
    return { code: 'PAST_DATE', field: 'date', message: 'Cannot book a past date' }
  }

  const nowMinutes = now.hour() * 60 + now.minute()
  if (bookingDate.isSame(now, 'day') && startMinutes < nowMinutes) {
    return { code: 'PAST_TIME', field: 'start', message: 'Start time has already passed' }
  }

  const hasOverlap = bookings.some(
    (booking) => booking.id !== excludeId && booking.date === date && isOverlapping(slot, booking),
  )
  if (hasOverlap) {
    return {
      code: 'OVERLAP',
      field: 'start',
      message: 'This time overlaps with another booking',
    }
  }

  return null
}
