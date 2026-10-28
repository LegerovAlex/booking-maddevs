import dayjs, { type Dayjs } from 'dayjs'
import type { Booking } from '../model/types'

export const isBookingStarted = ({ date, start }: Booking, now: Dayjs) =>
  !dayjs(`${date}T${start}`).isAfter(now)
