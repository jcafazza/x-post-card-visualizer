'use client'

import { useEffect, useRef, useState } from 'react'
import InteractivePostCard from '@/components/InteractivePostCard'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { getThemeStyles } from '@/lib/themes'
import { setTimezoneCookieIfMissing } from '@/lib/tz-cookie'
import type { CardSettings, PostData, Theme } from '@/types/post'
import {
  ENTRANCE_DELAY_CARD,
  THEME_TRANSITION,
  FOOTER_FADE_HEIGHT,
  FOOTER_FADE_OPACITY,
  FOOTER_FADE_STOP,
  FOOTER_SCROLL_CLEAR_EXTRA,
  SHARE_PHASE2_DELAY_MS,
  VIEWPORT_EDGE_MARGIN_PX,
} from '@/constants/ui'
import { hexToRgba } from '@/lib/utils'
import { CARD_DEFAULT_RADIUS, CARD_DEFAULT_WIDTH } from '@/constants/card'

const MOBILE_PLACEHOLDER_POST: Omit<PostData, 'timestamp'> = {
  author: {
    name: 'John Cafazza',
    handle: '@johncafazza',
    avatar: '/avatars/avatarJohn.png',
    verified: false,
  },
  content: {
    text: "Sorry friend, the mobile experience isn't quite ready yet.",
    images: [],
  },
}

function getMobileInitialSettings(initialTheme: Theme): CardSettings {
  return {
    theme: initialTheme,
    borderRadius: '20',
    shadowIntensity: 'floating',
    showDate: true,
    cardWidth: CARD_DEFAULT_WIDTH,
    customBorderRadius: CARD_DEFAULT_RADIUS,
  }
}

/**
 * Mobile placeholder screen: same structure, UI, and animations as the share/link preview page.
 * Shows a single post card with fixed "not ready" content and visit timestamp.
 * Uses time-of-day theme (same as customize view) via initialTheme.
 */
export default function MobilePlaceholderView({ initialTheme }: { initialTheme: Theme }) {
  const theme = getThemeStyles(initialTheme)
  const [post, setPost] = useState<PostData | null>(null)
  const [settings] = useState<CardSettings>(() => getMobileInitialSettings(initialTheme))
  const [cardRevealed, setCardRevealed] = useState(false)
  const [phase2Revealed, setPhase2Revealed] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phase2TimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setTimezoneCookieIfMissing()
  }, [])

  useEffect(() => {
    setPost({
      ...MOBILE_PLACEHOLDER_POST,
      timestamp: new Date().toISOString(),
    })
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--share-bg', theme.appBg)
    root.style.setProperty('--share-text', theme.appText)
    root.style.setProperty('--share-muted', theme.textSecondary)
    return () => {
      root.style.removeProperty('--share-bg')
      root.style.removeProperty('--share-text')
      root.style.removeProperty('--share-muted')
    }
  }, [theme.appBg, theme.appText, theme.textSecondary])

  useEffect(() => {
    if (!post) return
    let cancelled = false
    const delay = prefersReducedMotion ? 0 : ENTRANCE_DELAY_CARD
    revealTimeoutRef.current = setTimeout(() => {
      if (!cancelled) setCardRevealed(true)
      revealTimeoutRef.current = null
    }, delay)
    return () => {
      cancelled = true
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current)
        revealTimeoutRef.current = null
      }
    }
  }, [post, prefersReducedMotion])

  useEffect(() => {
    if (!cardRevealed || prefersReducedMotion) return
    phase2TimeoutRef.current = setTimeout(() => {
      setPhase2Revealed(true)
      phase2TimeoutRef.current = null
    }, SHARE_PHASE2_DELAY_MS)
    return () => {
      if (phase2TimeoutRef.current) {
        clearTimeout(phase2TimeoutRef.current)
        phase2TimeoutRef.current = null
      }
    }
  }, [cardRevealed, prefersReducedMotion])

  if (!post) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-12"
        style={{
          transition: THEME_TRANSITION,
          backgroundColor: `var(--share-bg, ${theme.appBg})`,
          color: `var(--share-text, ${theme.appText})`,
        }}
      >
        <div aria-hidden className="min-h-[40vh]" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-12"
      style={{
        transition: THEME_TRANSITION,
        backgroundColor: `var(--share-bg, ${theme.appBg})`,
        color: `var(--share-text, ${theme.appText})`,
      }}
    >
      <div style={{ paddingBottom: `${FOOTER_FADE_HEIGHT + FOOTER_SCROLL_CLEAR_EXTRA}px` }}>
        <div
          className={cardRevealed ? 'share-card-entrance' : undefined}
          style={
            cardRevealed
              ? undefined
              : {
                  opacity: 0,
                  transform: 'translateY(100vh)',
                }
          }
        >
          <InteractivePostCard
            post={post}
            settings={settings}
            onSettingsChange={() => {}}
            lockLayout
            sharePhase2Revealed={phase2Revealed}
          />
        </div>
        <MobilePlaceholderFooter theme={theme} />
      </div>
    </div>
  )
}

function MobilePlaceholderFooter({
  theme,
}: {
  theme: ReturnType<typeof getThemeStyles>
}) {
  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none z-[40]"
        style={{ height: FOOTER_FADE_HEIGHT }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: hexToRgba(theme.appBg, FOOTER_FADE_OPACITY),
            transition: THEME_TRANSITION,
            maskImage: `linear-gradient(to top, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to top, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            maskImage: `linear-gradient(to top, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to top, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
            pointerEvents: 'none',
          }}
        />
      </div>
      <div
        className="fixed bottom-5 left-0 right-0 text-xs font-medium text-center z-[50]"
        style={{
          paddingLeft: VIEWPORT_EDGE_MARGIN_PX,
          paddingRight: VIEWPORT_EDGE_MARGIN_PX,
          color: theme.textTertiary,
          opacity: 0.6,
          transition: THEME_TRANSITION,
          pointerEvents: 'none',
        }}
      >
        No login. No tracking. We don&apos;t store your posts. Public posts only.
      </div>
    </>
  )
}
