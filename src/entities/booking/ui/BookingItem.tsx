import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import type { Booking } from '../model/types'

type BookingItemProps = {
  booking: Booking
  isPast?: boolean
  actions?: ReactNode
  selected?: boolean
}

export function BookingItem({
  booking,
  isPast = false,
  actions,
  selected = false,
}: BookingItemProps) {
  const { title, start, end } = booking
  const time = `${start}-${end}`

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        borderRadius: 1,
        bgcolor: selected ? 'secondary.main' : isPast ? 'text.disabled' : 'primary.main',
        color: selected
          ? 'secondary.contrastText'
          : isPast
            ? 'text.secondary'
            : 'primary.contrastText',
      }}
    >
      <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
        {title ? `${title}, ${time}` : time}
      </Typography>
      {actions}
    </Box>
  )
}
