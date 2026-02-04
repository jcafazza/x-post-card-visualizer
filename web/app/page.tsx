import { cookies } from 'next/headers'
import AppWithMobileGate from '@/components/AppWithMobileGate'
import { TZ_COOKIE_NAME } from '@/lib/tz-cookie'
import { getThemeForTimeOfDayFromTimezone } from '@/lib/time-theme'

export default async function Page() {
  const cookieStore = await cookies()
  const tz = cookieStore.get(TZ_COOKIE_NAME)?.value ?? ''
  const initialTheme = getThemeForTimeOfDayFromTimezone(tz)
  return <AppWithMobileGate initialTheme={initialTheme} />
}
