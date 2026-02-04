'use client'

import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Image from 'next/image'
import InteractivePostCard from '@/components/InteractivePostCard'
import Toolbar from '@/components/Toolbar'
import URLInput from '@/components/URLInput'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import SnippetModal from '@/components/SnippetModal'
import { buildSnippet } from '@/lib/snippet'
import { PostData, CardSettings } from '@/types/post'
import type { Theme } from '@/types/post'
import { getDefaultPlaceholder } from '@/lib/placeholder'
import { getThemeStyles } from '@/lib/themes'
import { hexToRgba } from '@/lib/utils'
import {
  ANIMATION_STANDARD,
  ANIMATION_DELIBERATE,
  ANIMATION_EXTENDED,
  EASING_STANDARD,
  EASING_BOUNCE,
  THEME_TRANSITION,
  ENTRANCE_DELAY_HEADER,
  ENTRANCE_DELAY_TOOLBAR,
  ENTRANCE_DELAY_CARD,
  CONTENT_VERTICAL_SPACING,
  TOOLBAR_CARD_SPACING,
  FOOTER_FADE_HEIGHT,
  TOOLBAR_FADE_ZONE,
  FOOTER_FADE_OPACITY,
  FOOTER_FADE_STOP,
  FOOTER_SCROLL_CLEAR_EXTRA,
  VIEWPORT_EDGE_MARGIN_PX,
} from '@/constants/ui'
import { setTimezoneCookieIfMissing } from '@/lib/tz-cookie'

function getDefaultSettings(initialTheme: Theme): CardSettings {
  return {
    theme: initialTheme,
    borderRadius: '20',
    shadowIntensity: 'floating',
    showDate: true,
    cardWidth: 500,
    customBorderRadius: 20,
  }
}

interface HomePageProps {
  initialTheme: Theme
}

export default function HomePage({ initialTheme }: HomePageProps) {
  const [post, setPost] = useState<PostData | null>(() => getDefaultPlaceholder())
  const [sourceUrl, setSourceUrl] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [settings, setSettings] = useState<CardSettings>(() => getDefaultSettings(initialTheme))
  const [logoAnimation, setLogoAnimation] = useState(false)
  const [toolbarOpacity, setToolbarOpacity] = useState(1)
  const [snippetDrawerOpen, setSnippetDrawerOpen] = useState(false)
  const [snippetModalKey, setSnippetModalKey] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setTimezoneCookieIfMissing()
  }, [])

  const openSnippetModal = () => {
    setSnippetModalKey((k) => k + 1)
    setSnippetDrawerOpen(true)
  }
  const mainRef = useRef<HTMLElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const handleReset = () => {
    setPost(getDefaultPlaceholder())
    setSourceUrl(null)
    setUrlInput('')
    setSettings(getDefaultSettings(initialTheme))
  }

  const theme = getThemeStyles(settings.theme)

  const HEADER_BOTTOM = 24 + 68
  const TOOLBAR_TOP_MARGIN = HEADER_BOTTOM + CONTENT_VERTICAL_SPACING

  useEffect(() => {
    const main = mainRef.current
    const toolbar = toolbarRef.current
    if (!main || !toolbar || prefersReducedMotion) return

    const handleScroll = () => {
      try {
        const toolbarRect = toolbar.getBoundingClientRect()
        const toolbarTop = toolbarRect.top
        const toolbarBottom = toolbarRect.bottom
        const viewportHeight = window.innerHeight
        const fadeZone = TOOLBAR_FADE_ZONE

        if (toolbarBottom < -fadeZone || toolbarTop > viewportHeight + fadeZone) {
          setToolbarOpacity(0)
        } else if (toolbarTop < -fadeZone) {
          const progress = Math.min(1, Math.max(0, (toolbarTop + fadeZone) / fadeZone))
          setToolbarOpacity(1 - progress)
        } else if (toolbarBottom > viewportHeight + fadeZone) {
          const progress = Math.min(1, Math.max(0, (toolbarBottom - viewportHeight) / fadeZone))
          setToolbarOpacity(1 - progress)
        } else {
          setToolbarOpacity(1)
        }
      } catch {
        // Safari/WebKit can throw during scroll events
      }
    }

    main.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      main.removeEventListener('scroll', handleScroll)
    }
  }, [prefersReducedMotion])

  return (
    <div
      className="min-h-screen font-sans selection:bg-neutral-500/30 flex flex-col overflow-hidden relative"
      style={{
        transition: THEME_TRANSITION,
        backgroundColor: theme.appBg,
        color: theme.appText
      }}
    >
      {/* Top fade plate */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none z-[45]"
        style={{ height: FOOTER_FADE_HEIGHT }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: hexToRgba(theme.appBg, FOOTER_FADE_OPACITY),
            transition: prefersReducedMotion ? 'none' : THEME_TRANSITION,
            maskImage: `linear-gradient(to bottom, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            maskImage: `linear-gradient(to bottom, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${FOOTER_FADE_STOP * 100}%, transparent 100%)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 isolate"
        style={{ width: `min(550px, calc(100vw - ${2 * VIEWPORT_EDGE_MARGIN_PX}px))` }}
      >
        <header
          className={prefersReducedMotion ? "flex items-center justify-center gap-3 px-3 py-3 border rounded-full w-full" : "flex items-center justify-center gap-3 px-3 py-3 border rounded-full w-full animate-in fade-in slide-in-from-top-4"}
          style={{
            ...(prefersReducedMotion ? {} : {
              animationDuration: `${ANIMATION_EXTENDED}ms`,
              animationTimingFunction: EASING_STANDARD,
              animationDelay: `${ENTRANCE_DELAY_HEADER}ms`,
            }),
            transition: prefersReducedMotion ? 'none' : THEME_TRANSITION,
            backgroundColor: theme.headerBg,
            borderColor: theme.headerOuterStroke,
            borderWidth: '1px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
        <button
          type="button"
          aria-label="X logo"
          className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden gap-0 bg-transparent border-0 p-0 cursor-pointer"
          style={{
            backgroundColor: theme.appText,
            transition: prefersReducedMotion ? 'none' : THEME_TRANSITION,
          }}
          onDoubleClick={() => {
            if (!prefersReducedMotion) {
              setLogoAnimation(true)
              setTimeout(() => setLogoAnimation(false), ANIMATION_STANDARD)
            }
          }}
        >
          <Image
            src="/assets/xLogo.svg"
            alt=""
            width={16}
            height={16}
            style={{
              width: 16,
              height: 16,
              objectFit: 'contain',
              transition: prefersReducedMotion ? 'none' : THEME_TRANSITION + `, transform ${ANIMATION_STANDARD}ms ${EASING_BOUNCE}`,
              filter: theme.appBg === '#FAFAFA' ? 'invert(1)' : 'none',
              transform: logoAnimation ? 'rotate(360deg) scale(1.2)' : 'rotate(0deg) scale(1)',
            }}
          />
        </button>
        <div className="min-w-0 flex-1">
          <URLInput
            onPostLoad={setPost}
            onSourceUrlChange={setSourceUrl}
            onClear={handleReset}
            theme={theme}
            url={urlInput}
            onUrlChange={setUrlInput}
          />
        </div>
        </header>
      </div>

      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="min-h-full flex flex-col items-center px-12">
          <div
            ref={toolbarRef}
            className={prefersReducedMotion ? "relative w-full flex justify-center z-40" : "relative w-full flex justify-center z-40 animate-in fade-in slide-in-from-bottom-2"}
            style={{
              marginTop: `${TOOLBAR_TOP_MARGIN}px`,
              opacity: prefersReducedMotion ? 1 : toolbarOpacity,
              transition: prefersReducedMotion ? 'none' : THEME_TRANSITION,
              ...(prefersReducedMotion ? {} : {
                animationDuration: `${ANIMATION_STANDARD}ms`,
                animationTimingFunction: EASING_STANDARD,
                animationDelay: `${ENTRANCE_DELAY_TOOLBAR}ms`,
              }),
            }}
          >
            <Toolbar
              settings={settings}
              onSettingsChange={setSettings}
              currentTheme={theme}
              onReset={handleReset}
              cardWidth={settings.cardWidth}
              sourceUrl={sourceUrl}
              onCopySnippetClick={openSnippetModal}
            />
          </div>
          <div
            className={prefersReducedMotion ? "relative w-full flex justify-center" : "relative w-full flex justify-center animate-in fade-in slide-in-from-bottom-6"}
            style={{
              marginTop: `${TOOLBAR_CARD_SPACING}px`,
              paddingBottom: `${FOOTER_FADE_HEIGHT + FOOTER_SCROLL_CLEAR_EXTRA}px`,
              ...(prefersReducedMotion ? {} : {
                animationDuration: `${ANIMATION_DELIBERATE}ms`,
                animationTimingFunction: EASING_STANDARD,
                animationDelay: `${ENTRANCE_DELAY_CARD}ms`,
              }),
            }}
          >
            {post && (
              <ErrorBoundary theme={settings.theme}>
                <InteractivePostCard
                  post={post}
                  settings={settings}
                  onSettingsChange={setSettings}
                  sourceUrl={sourceUrl ?? undefined}
                />
              </ErrorBoundary>
            )}
          </div>
        </div>
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none z-[40]"
        style={{ height: FOOTER_FADE_HEIGHT }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: hexToRgba(theme.appBg, FOOTER_FADE_OPACITY),
            transition: prefersReducedMotion ? 'none' : THEME_TRANSITION,
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

      <SnippetModal
        key={snippetModalKey}
        isOpen={snippetDrawerOpen}
        onClose={() => setSnippetDrawerOpen(false)}
        snippet={buildSnippet(settings, sourceUrl)}
        theme={theme}
      />

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
        No login. No tracking. We don’t store your posts. Public posts only.
      </div>
    </div>
  )
}
