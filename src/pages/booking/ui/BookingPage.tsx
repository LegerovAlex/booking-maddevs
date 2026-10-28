import { useState } from 'react'
import dayjs from 'dayjs'
import { Box, Container, Stack, Typography } from '@mui/material'
import type { Booking } from '@/entities/booking'
import { BookingForm } from '@/features/booking-form'
import { DateSelector } from '@/features/date-selector'

import { BookingList } from '@/widgets/booking-list'
import { DATE_FORMAT } from '@/shared/lib/time'
import { DeleteBookingDialog } from '@/features/delete-booking'

export function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format(DATE_FORMAT))
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null)

  const changeDate = (date: string) => {
    setSelectedDate(date)
    setEditingBooking(null)
  }

  const handleDeleted = (booking: Booking) => {
    if (editingBooking?.id === booking.id) setEditingBooking(null)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'center', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Meeting room booking
        </Typography>
        <DateSelector value={selectedDate} onChange={changeDate} />
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 3, alignItems: 'start' }}>
        <BookingList
          date={selectedDate}
          selectedId={editingBooking?.id}
          onEdit={setEditingBooking}
          onDelete={setDeletingBooking}
        />
        <BookingForm
          key={editingBooking?.id ?? `new-${selectedDate}`}
          date={selectedDate}
          booking={editingBooking}
          onDone={() => setEditingBooking(null)}
        />
      </Box>
      <DeleteBookingDialog
        booking={deletingBooking}
        onClose={() => setDeletingBooking(null)}
        onDeleted={handleDeleted}
      />
    </Container>
  )
}
