import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useDeleteBooking } from '@/entities/booking'
import type { Booking } from '@/entities/booking'

type DeleteBookingDialogProps = {
  booking: Booking | null
  onClose: () => void
  onDeleted?: (booking: Booking) => void
}

export function DeleteBookingDialog({ booking, onClose, onDeleted }: DeleteBookingDialogProps) {
  const deleteBooking = useDeleteBooking()
  const [shownBooking, setShownBooking] = useState(booking)

  if (booking && booking !== shownBooking) {
    setShownBooking(booking)
  }

  const handleClose = () => {
    if (deleteBooking.isPending) return
    deleteBooking.reset()
    onClose()
  }

  const handleDelete = () => {
    if (!booking) return

    deleteBooking.mutate(booking.id, {
      onSuccess: () => {
        onDeleted?.(booking)
        deleteBooking.reset()
        onClose()
      },
    })
  }

  return (
    <Dialog
      open={Boolean(booking)}
      onClose={handleClose}
      aria-labelledby="delete-booking-title"
      aria-describedby="delete-booking-description"
    >
      <DialogTitle id="delete-booking-title">Delete booking?</DialogTitle>

      <DialogContent>
        <DialogContentText id="delete-booking-description">
          {shownBooking &&
            `"${shownBooking.title || 'Untitled'}", ${shownBooking.start}-${shownBooking.end} will be deleted. This can't be undone.`}
        </DialogContentText>

        {deleteBooking.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {deleteBooking.error.message}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={deleteBooking.isPending}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          loading={deleteBooking.isPending}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
