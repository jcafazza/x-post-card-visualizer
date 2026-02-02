/**
 * Formats an ISO timestamp for display in the card footer
 * (e.g. "Jan 22, 2026 · 11:37 PM"). Uses the user's locale.
 * Returns null for invalid or missing input so callers can hide the footer.
 */
export function formatPostTimestamp(isoTimestamp: string | undefined | null): string | null {
  if (!isoTimestamp || typeof isoTimestamp !== 'string') return null
  const date = new Date(isoTimestamp)
  if (Number.isNaN(date.getTime())) return null
  const datePart = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const timePart = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${datePart} · ${timePart}`
}
