import type { Theme } from '@/types/post'

/**
 * Hour boundaries for time-of-day theme (24h, local time).
 * light: morning/afternoon, dim: evening, dark: night.
 */
const HOUR_LIGHT_END = 18 // 6 PM
const HOUR_DIM_END = 22   // 10 PM
// 22–6 = dark, 6–18 = light, 18–22 = dim

/**
 * Returns theme for a given local hour (0–23).
 */
export function getThemeForTimeOfDay(localHour: number): Theme {
  const h = Math.floor(Number(localHour))
  if (h >= HOUR_DIM_END || h < 6) return 'dark'
  if (h >= HOUR_LIGHT_END) return 'dim'
  return 'light'
}

/**
 * Returns current local hour (0–23) in the given IANA timezone.
 * Safe for server (Node) and edge; uses Intl.
 */
export function getLocalHourInTimezone(timezone: string): number {
  try {
    const s = new Date().toLocaleString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    })
    const n = parseInt(s, 10)
    return Number.isFinite(n) ? n % 24 : 12
  } catch {
    return 12
  }
}

/**
 * Returns theme for the user's current time of day in the given timezone.
 * Use on the server with a timezone from cookie; defaults to 'light' on invalid tz.
 */
export function getThemeForTimeOfDayFromTimezone(timezone: string): Theme {
  if (!timezone || typeof timezone !== 'string') return 'light'
  const hour = getLocalHourInTimezone(timezone.trim())
  return getThemeForTimeOfDay(hour)
}
