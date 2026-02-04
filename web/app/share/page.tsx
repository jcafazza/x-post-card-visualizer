import { Suspense } from 'react'
import { cookies } from 'next/headers'
import InteractiveSharePage from './share-client'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getThemeStyles } from '@/lib/themes'
import { THEME_TRANSITION } from '@/constants/ui'
import { TZ_COOKIE_NAME } from '@/lib/tz-cookie'
import { getThemeForTimeOfDayFromTimezone } from '@/lib/time-theme'

/**
 * Share Preview Page
 *
 * A minimal, interactive page for viewing and tinkering with shared X post cards.
 * Accepts design settings via URL search parameters.
 * Uses time-of-day theme (same as customize view) when URL does not specify a theme.
 */
export default async function SharePage() {
  const cookieStore = await cookies()
  const tz = cookieStore.get(TZ_COOKIE_NAME)?.value ?? ''
  const defaultTheme = getThemeForTimeOfDayFromTimezone(tz)
  const theme = getThemeStyles(defaultTheme)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-12"
      style={{
        transition: THEME_TRANSITION,
        backgroundColor: `var(--share-bg, ${theme.appBg})`,
        color: `var(--share-text, ${theme.appText})`,
      }}
    >
      <ErrorBoundary theme={defaultTheme}>
        <Suspense fallback={<div aria-hidden className="min-h-[40vh]" />}>
          <InteractiveSharePage defaultTheme={defaultTheme} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
