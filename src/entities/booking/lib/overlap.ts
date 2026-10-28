import { timeToMinutes } from '@/shared/lib/time'

type TimeRange = {
  start: string
  end: string
}

export const isOverlapping = (a: TimeRange, b: TimeRange) =>
  timeToMinutes(a.start) < timeToMinutes(b.end) && timeToMinutes(b.start) < timeToMinutes(a.end)
