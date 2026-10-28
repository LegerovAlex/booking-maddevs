import { BOOKING_CONFIG } from '@/entities/booking'
import { minutesToTime, timeToMinutes } from '@/shared/lib/time'
import { ROW_HEIGHT, ROW_MINUTES } from '../config/timeline'

type TimeRange = {
  start: string
  end: string
}

const dayStartMinutes = timeToMinutes(BOOKING_CONFIG.workingDayStart)
const dayEndMinutes = timeToMinutes(BOOKING_CONFIG.workingDayEnd)

const toPx = (minutes: number) => (minutes / ROW_MINUTES) * ROW_HEIGHT

export const timelineRows = Array.from(
  { length: (dayEndMinutes - dayStartMinutes) / ROW_MINUTES },
  (_, index) => minutesToTime(dayStartMinutes + index * ROW_MINUTES),
)

export const getTimelinePosition = ({ start, end }: TimeRange) => ({
  top: toPx(timeToMinutes(start) - dayStartMinutes),
  height: toPx(timeToMinutes(end) - timeToMinutes(start)),
})
