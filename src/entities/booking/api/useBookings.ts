import { useQuery } from '@tanstack/react-query'
import { bookingApi } from './bookingApi'
import { bookingKeys } from './bookingKeys'

export const useBookings = (date: string) =>
  useQuery({
    queryKey: bookingKeys.byDate(date),
    queryFn: () => bookingApi.getByDate(date),
  })
