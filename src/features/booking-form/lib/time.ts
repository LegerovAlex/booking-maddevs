import { BOOKING_CONFIG } from '@/entities/booking'
import { minutesToTime, timeToMinutes } from '@/shared/lib/time'

const { workingDayStart, workingDayEnd, timeStepMinutes } = BOOKING_CONFIG
const dayStartMinutes = timeToMinutes(workingDayStart)
const dayEndMinutes = timeToMinutes(workingDayEnd)

const timeOptions = Array.from(
  { length: (dayEndMinutes - dayStartMinutes) / timeStepMinutes + 1 },
  (_, index) => minutesToTime(dayStartMinutes + index * timeStepMinutes),
)

export const startOptions = timeOptions.slice(0, -1)
export const endOptions = timeOptions.slice(1)
