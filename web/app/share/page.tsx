import { Suspense } from 'react'
import InteractiveSharePage from './share-client'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getThemeStyles } from '@/lib/themes'
import { THEME_TRANSITION } from '@/constants/ui'

/**
 * Share Preview Page
 *
 * A minimal, interactive page for viewing and tinkering with shared X post cards.
 * Accepts design settings via URL search parameters.
 */
export default function SharePage() {
  const theme = getThemeStyles('light')

  return (
    <div
      className="min-h-screen flex items-center justify-center p-12"
      style={{
        transition: THEME_TRANSITION,
        backgroundColor: `var(--share-bg, ${theme.appBg})`,
        color: `var(--share-text, ${theme.appText})`,
      }}
    >
      <ErrorBoundary theme="light">
        <Suspense fallback={<div aria-hidden className="min-h-[40vh]" />}>
          <InteractiveSharePage />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
