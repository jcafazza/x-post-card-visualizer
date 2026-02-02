/**
 * Utility functions for the X Post Visualizer.
 */
import { BorderRadius } from '@/types/post'

const VALID_RADII: BorderRadius[] = ['0', '8', '16', '20', '24']

/**
 * Converts a hex color to rgba with the given opacity.
 * Handles #RGB and #RRGGBB formats.
 */
export function hexToRgba(hex: string, opacity: number): string {
  if (!hex || !hex.startsWith('#')) return hex || '#000000'
  let r: number, g: number, b: number
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16)
    g = parseInt(hex.slice(3, 5), 16)
    b = parseInt(hex.slice(5, 7), 16)
  } else {
    return hex
  }
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/** Type guard: true if value is a valid BorderRadius ('0' | '8' | '16' | '20' | '24'). */
export function isBorderRadius(value: unknown): value is BorderRadius {
  return typeof value === 'string' && VALID_RADII.includes(value as BorderRadius)
}

/**
 * Formats an ISO timestamp for the card footer (e.g. "Jan 22, 2026 · 11:37 PM").
 * Returns null for invalid or missing input. Kept in sync with packages/x-post-card-visualizer/src/utils.ts
 * so the web app can build without resolving the workspace package (e.g. on Vercel when only web is deployed).
 */
export function formatPostTimestamp(isoTimestamp: string | undefined | null): string | null {
  if (!isoTimestamp || typeof isoTimestamp !== 'string') return null
  const date = new Date(isoTimestamp)
  if (Number.isNaN(date.getTime())) return null
  const datePart = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const timePart = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${datePart} · ${timePart}`
}
