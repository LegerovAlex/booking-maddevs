import { BookingPage } from '@/pages/booking'
import { AppProviders } from './providers/AppProviders'

export function App() {
  return (
    <AppProviders>
      <BookingPage />
    </AppProviders>
  )
}
