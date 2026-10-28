import dayjs from 'dayjs'

export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/
export const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

export const DATE_FORMAT = 'YYYY-MM-DD'

export const isValidTime = (value: string) => TIME_REGEX.test(value)

export const isValidDate = (value: string) =>
  DATE_REGEX.test(value) && dayjs(value).format(DATE_FORMAT) === value

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const minutesToTime = (totalMinutes: number) => {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')
  return `${hours}:${minutes}`
}
