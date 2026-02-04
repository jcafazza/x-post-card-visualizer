'use client'

import HomePage from '@/components/HomePage'
import MobilePlaceholderView from '@/components/MobilePlaceholderView'
import type { Theme } from '@/types/post'

interface AppWithMobileGateProps {
  initialTheme: Theme
}

/**
 * Renders the full app on viewports ≥451px and the mobile "not ready" placeholder below 450px.
 * Uses CSS media queries so the correct view is shown without hydration mismatch.
 * Breakpoint must stay in sync with MOBILE_BREAKPOINT_MAX in constants/ui.ts.
 */
export default function AppWithMobileGate({ initialTheme }: AppWithMobileGateProps) {
  return (
    <>
      <div className="min-[451px]:block max-[450px]:hidden">
        <HomePage initialTheme={initialTheme} />
      </div>
      <div className="max-[450px]:block min-[451px]:hidden">
        <MobilePlaceholderView initialTheme={initialTheme} />
      </div>
    </>
  )
}
