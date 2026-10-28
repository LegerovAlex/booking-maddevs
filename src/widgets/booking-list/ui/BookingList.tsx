import dayjs from 'dayjs'
import { Alert, Box, CircularProgress, IconButton, Paper, Typography } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { BOOKING_CONFIG, BookingItem, isBookingStarted, useBookings } from '@/entities/booking'
import type { Booking } from '@/entities/booking'
import { LABEL_WIDTH, ROW_HEIGHT } from '../config/timeline'
import { getTimelinePosition, timelineRows } from '../lib/timeline'

type BookingListProps = {
  date: string
  selectedId?: string
  onEdit?: (booking: Booking) => void
  onDelete?: (booking: Booking) => void
}

export function BookingList({ date, selectedId, onEdit, onDelete }: BookingListProps) {
  const { data: bookings, isPending, isError, error } = useBookings(date)
  const now = dayjs()
  const { workingDayStart, workingDayEnd } = BOOKING_CONFIG

  const renderActions = (booking: Booking) => {
    const label = `${booking.start}-${booking.end}`

    return (
      <>
        <IconButton
          size="small"
          color="inherit"
          aria-label={`Edit booking ${label}`}
          onClick={() => onEdit?.(booking)}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="inherit"
          aria-label={`Delete booking ${label}`}
          onClick={() => onDelete?.(booking)}
        >
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </>
    )
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" component="h2" sx={{ mb: 1 }}>
        Bookings, {workingDayStart}-{workingDayEnd}
      </Typography>

      {isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label="Loading bookings" />
        </Box>
      )}

      {isError && <Alert severity="error">{error.message}</Alert>}

      {bookings && (
        <>
          {bookings.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              No bookings for this day
            </Typography>
          )}

          <Box sx={{ position: 'relative' }}>
            {timelineRows.map((time) => (
              <Box key={time} sx={{ height: ROW_HEIGHT, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {time}
                </Typography>
              </Box>
            ))}

            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {bookings.map((booking) => {
                const isPast = isBookingStarted(booking, now)

                return (
                  <Box
                    component="li"
                    key={booking.id}
                    sx={{
                      position: 'absolute',
                      left: LABEL_WIDTH,
                      right: 0,
                      ...getTimelinePosition(booking),
                      py: '2px',
                    }}
                  >
                    <BookingItem
                      booking={booking}
                      isPast={isPast}
                      selected={booking.id === selectedId}
                      actions={!isPast && renderActions(booking)}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </>
      )}
    </Paper>
  )
}
