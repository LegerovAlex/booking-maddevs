import dayjs from 'dayjs'
import type { Booking, BookingInput, BookingPatch } from '@/entities/booking'
import { DATE_FORMAT } from '@/shared/lib/time'

const today = dayjs().format(DATE_FORMAT)
const tomorrow = dayjs().add(1, 'day').format(DATE_FORMAT)
const yesterday = dayjs().subtract(1, 'day').format(DATE_FORMAT)

let bookings: Booking[] = [
  { id: crypto.randomUUID(), date: yesterday, start: '14:00', end: '15:00', title: 'Retro' },
  { id: crypto.randomUUID(), date: today, start: '10:00', end: '11:00', title: 'Daily standup' },
  { id: crypto.randomUUID(), date: today, start: '11:00', end: '11:30', title: '1:1' },
  { id: crypto.randomUUID(), date: today, start: '15:00', end: '16:30', title: 'Design review' },
  { id: crypto.randomUUID(), date: tomorrow, start: '09:30', end: '10:30', title: 'Planning' },
  { id: crypto.randomUUID(), date: tomorrow, start: '14:00', end: '15:30', title: 'Demo' },
]

export const db = {
  getAll: () => bookings,

  getByDate: (date: string) =>
    bookings
      .filter((booking) => booking.date === date)
      .sort((a, b) => a.start.localeCompare(b.start)),

  findById: (id: string) => bookings.find((booking) => booking.id === id),

  create: (input: BookingInput) => {
    const booking: Booking = { id: crypto.randomUUID(), ...input }
    bookings.push(booking)
    return booking
  },

  update: (id: string, patch: BookingPatch) => {
    let updated: Booking | undefined
    bookings = bookings.map((booking) => {
      if (booking.id !== id) return booking
      updated = { ...booking, ...patch }
      return updated
    })
    return updated
  },

  remove: (id: string) => {
    bookings = bookings.filter((booking) => booking.id !== id)
  },
}
