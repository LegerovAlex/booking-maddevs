import { http } from '@/shared/api'
import type { Booking, BookingInput, BookingPatch } from '../model/types'

const BOOKINGS_URL = '/bookings'

export const bookingApi = {
  getByDate: async (date: string) => {
    const { data } = await http.get<Booking[]>(BOOKINGS_URL, { params: { date } })
    return data
  },

  create: async (input: BookingInput) => {
    const { data } = await http.post<Booking>(BOOKINGS_URL, input)
    return data
  },

  update: async (id: string, patch: BookingPatch) => {
    const { data } = await http.patch<Booking>(`${BOOKINGS_URL}/${id}`, patch)
    return data
  },

  remove: async (id: string) => {
    await http.delete(`${BOOKINGS_URL}/${id}`)
  },
}
