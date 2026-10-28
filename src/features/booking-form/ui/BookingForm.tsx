import { useMemo } from 'react'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useBookings, useCreateBooking, useUpdateBooking } from '@/entities/booking'
import type { Booking } from '@/entities/booking'
import { isApiError } from '@/shared/api'
import { timeToMinutes } from '@/shared/lib/time'
import { createBookingSchema, type BookingFormValues } from '../model/bookingSchema'
import { endOptions, startOptions } from '../lib/time'

const CONFLICT_MESSAGE =
  'This slot was just taken. Bookings refreshed, your input is kept. Pick another time.'

type BookingFormProps = {
  date: string
  booking?: Booking | null
  onDone: () => void
}

const getDefaultValues = (date: string, booking?: Booking | null): BookingFormValues => ({
  title: booking?.title ?? '',
  date,
  start: booking?.start ?? '',
  end: booking?.end ?? '',
})

export function BookingForm({ date, booking, onDone }: BookingFormProps) {
  const { data: bookings = [] } = useBookings(date)
  const createBooking = useCreateBooking()
  const updateBooking = useUpdateBooking()
  const mutation = booking ? updateBooking : createBooking

  const excludeId = booking?.id
  const schema = useMemo(() => createBookingSchema({ bookings, excludeId }), [bookings, excludeId])

  const { control, handleSubmit, reset } = useForm<BookingFormValues>({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(date, booking),
  })

  const now = dayjs()
  const isPastDate = dayjs(date).isBefore(now, 'day')
  const isToday = dayjs(date).isSame(now, 'day')
  const nowMinutes = now.hour() * 60 + now.minute()
  const isPastOption = (time: string) => isToday && timeToMinutes(time) < nowMinutes

  const errorMessage =
    isApiError(mutation.error) && mutation.error.status === 409
      ? CONFLICT_MESSAGE
      : mutation.error?.message

  const finish = () => {
    reset(getDefaultValues(date))
    mutation.reset()
    onDone()
  }

  const onSubmit = ({ title, start, end }: BookingFormValues) => {
    const input = { date, start, end, title: title ?? '' }

    if (booking) {
      updateBooking.mutate({ id: booking.id, patch: input }, { onSuccess: finish })
    } else {
      createBooking.mutate(input, { onSuccess: finish })
    }
  }

  return (
    <Paper
      variant="outlined"
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: 2 }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle1" component="h2">
          {booking ? 'Edit booking' : 'New booking'}
        </Typography>

        {isPastDate && <Alert severity="info">Bookings cannot be created for past dates</Alert>}

        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Title (optional)"
              disabled={isPastDate}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Stack direction="row" spacing={2}>
          <Controller
            name="start"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Start"
                disabled={isPastDate}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {startOptions.map((time) => (
                  <MenuItem key={time} value={time} disabled={isPastOption(time)}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="end"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="End"
                disabled={isPastDate}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {endOptions.map((time) => (
                  <MenuItem key={time} value={time} disabled={isPastOption(time)}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={finish} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={mutation.isPending}
            disabled={isPastDate}
          >
            {booking ? 'Save changes' : 'Create booking'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
