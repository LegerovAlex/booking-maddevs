import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookingInput, BookingPatch } from '../model/types'
import { bookingApi } from './bookingApi'
import { bookingKeys } from './bookingKeys'

const useInvalidateBookings = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: bookingKeys.all })
}

export const useCreateBooking = () => {
  const invalidateBookings = useInvalidateBookings()

  return useMutation({
    mutationFn: (input: BookingInput) => bookingApi.create(input),
    onSettled: invalidateBookings,
  })
}

export const useUpdateBooking = () => {
  const invalidateBookings = useInvalidateBookings()

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: BookingPatch }) =>
      bookingApi.update(id, patch),
    onSettled: invalidateBookings,
  })
}

export const useDeleteBooking = () => {
  const invalidateBookings = useInvalidateBookings()

  return useMutation({
    mutationFn: (id: string) => bookingApi.remove(id),
    onSettled: invalidateBookings,
  })
}
