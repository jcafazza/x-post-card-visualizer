/**
 * Timezone cookie used by the server to send time-of-day theme (light/dim/dark).
 * Must match the cookie read in app/page.tsx and app/share/page.tsx.
 */
export const TZ_COOKIE_NAME = 'x-visualizer-tz'

const TZ_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year

/**
 * Set timezone cookie once so the server can send the correct time-based theme on next load (avoids flicker).
 * Call from client (useEffect) on any entry point: main page, share page, mobile placeholder.
 */
export function setTimezoneCookieIfMissing(): void {
  if (typeof document === 'undefined') return
  const has = document.cookie.includes(`${TZ_COOKIE_NAME}=`)
  if (has) return
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) return
    document.cookie = `${TZ_COOKIE_NAME}=${encodeURIComponent(tz)}; path=/; max-age=${TZ_COOKIE_MAX_AGE}; SameSite=Lax`
  } catch {
    // ignore
  }
}
