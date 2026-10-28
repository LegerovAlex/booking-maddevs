import dayjs from 'dayjs'
import { Button, IconButton, Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DATE_FORMAT } from '@/shared/lib/time'

type DateSelectorProps = {
  value: string
  onChange: (date: string) => void
}

export function DateSelector({ value, onChange }: DateSelectorProps) {
  const date = dayjs(value)
  const isToday = date.isSame(dayjs(), 'day')
  const shiftDays = (days: number) => onChange(date.add(days, 'day').format(DATE_FORMAT))

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <IconButton aria-label="Previous day" onClick={() => shiftDays(-1)}>
        <ChevronLeftIcon />
      </IconButton>

      <DatePicker
        label="Date"
        value={date}
        onChange={(next) => next?.isValid() && onChange(next.format(DATE_FORMAT))}
        format="ddd, MMM D, YYYY"
        slotProps={{ textField: { size: 'small' } }}
      />

      <IconButton aria-label="Next day" onClick={() => shiftDays(1)}>
        <ChevronRightIcon />
      </IconButton>

      <Button
        variant="outlined"
        disabled={isToday}
        onClick={() => onChange(dayjs().format(DATE_FORMAT))}
      >
        Today
      </Button>
    </Stack>
  )
}
