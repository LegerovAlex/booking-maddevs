import dayjs from 'dayjs'
import { delay, http, HttpResponse } from 'msw'
import { validateBooking } from '@/entities/booking'
import type { BookingInput, BookingPatch, BookingValidationError } from '@/entities/booking'
import { db } from './db'

const BOOKINGS_URL = '/api/bookings'

const validationErrorResponse = (error: BookingValidationError) =>
  HttpResponse.json(error, { status: error.code === 'OVERLAP' ? 409 : 422 })

const notFoundResponse = () =>
  HttpResponse.json({ code: 'NOT_FOUND', message: 'Booking not found' }, { status: 404 })

let mutationCount = 0
const isSimulatedConflict = () => ++mutationCount % 2 === 0

const simulatedConflictResponse = () =>
  HttpResponse.json(
    { code: 'OVERLAP', message: 'This slot was just taken by another booking' },
    { status: 409 },
  )

export const handlers = [
  http.get(BOOKINGS_URL, async ({ request }) => {
    await delay()
    const date = new URL(request.url).searchParams.get('date')
    if (!date) {
      return HttpResponse.json(
        { code: 'BAD_REQUEST', message: 'Query parameter "date" is required' },
        { status: 400 },
      )
    }
    return HttpResponse.json(db.getByDate(date))
  }),

  http.post(BOOKINGS_URL, async ({ request }) => {
    await delay()
    const { date, start, end, title } = (await request.json()) as BookingInput
    const input: BookingInput = { date, start, end, title }

    const error = validateBooking(input, { bookings: db.getAll(), now: dayjs() })
    if (error) return validationErrorResponse(error)
    if (isSimulatedConflict()) return simulatedConflictResponse()

    return HttpResponse.json(db.create(input), { status: 201 })
  }),

  http.patch<{ id: string }>(`${BOOKINGS_URL}/:id`, async ({ params, request }) => {
    await delay()
    const existing = db.findById(params.id)
    if (!existing) return notFoundResponse()

    const patch = (await request.json()) as BookingPatch
    const merged = { ...existing, ...patch, id: existing.id }

    const error = validateBooking(merged, {
      bookings: db.getAll(),
      now: dayjs(),
      excludeId: existing.id,
    })
    if (error) return validationErrorResponse(error)
    if (isSimulatedConflict()) return simulatedConflictResponse()

    return HttpResponse.json(db.update(existing.id, patch))
  }),

  http.delete<{ id: string }>(`${BOOKINGS_URL}/:id`, async ({ params }) => {
    await delay()
    if (!db.findById(params.id)) return notFoundResponse()

    db.remove(params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
