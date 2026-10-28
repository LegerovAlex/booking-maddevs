# Meeting Room Booking

- **Demo:** https://booking-maddevs.vercel.app/
- **AI chat:** [`AI CHAT.txt`](./AI%20CHAT.txt)
- **Time spent:** 4 hours

## How to run

```bash
npm install
npm run dev
```

The mock API (MSW) is enabled automatically via `VITE_API_MOCKING=true` in `.env`.

## What's done

- Date selection, a day timeline of bookings, creating, editing and deleting bookings.
- All business rules 1–8 are validated both on the client and in the mock API.
- Loading, empty day, error and form submission states.
- The network layer is separated from the UI and can be switched to a real API via `VITE_API_URL`.

**Rule 8:** the mock API intentionally returns 409 on every second successful save, so conflict handling can be checked.

## What's not done

- Tests for the core functionality.
- I would rework the architecture around deleting and editing.
- I would make the UX more accessible.
- Mobile version (desktop only).
