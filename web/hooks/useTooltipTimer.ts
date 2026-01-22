import { useEffect, useRef } from 'react'

/**
 * Custom hook to manage tooltip visibility with smooth fade animations.
 * Handles timer cleanup and prevents memory leaks.
 * 
 * @param tooltip - The tooltip text to display, or null to hide
 * @param onDisplayChange - Callback when tooltip should be shown/hidden
 * @param displayDuration - How long to show tooltip before starting fade (default: 1500ms)
 * @param fadeDuration - How long fade-out animation takes (default: 1000ms)
 */
export function useTooltipTimer(
  tooltip: string | null,
  onDisplayChange: (tooltip: string | null, isVisible: boolean) => void,
  displayDuration: number = 1500,
  fadeDuration: number = 1000
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing timer when tooltip changes
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (tooltip) {
      // New tooltip: show immediately
      onDisplayChange(tooltip, true)
      
      // Start fade-out timer after display duration
      timerRef.current = setTimeout(() => {
        onDisplayChange(tooltip, false)
        // Remove from DOM after fade animation completes
        timerRef.current = setTimeout(() => {
          onDisplayChange(null, false)
          timerRef.current = null
        }, fadeDuration)
      }, displayDuration)
    } else {
      // Tooltip cleared: start fade-out immediately
      onDisplayChange(null, false)
      // Remove from DOM after fade animation completes
      timerRef.current = setTimeout(() => {
        onDisplayChange(null, false)
        timerRef.current = null
      }, fadeDuration)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [tooltip, onDisplayChange, displayDuration, fadeDuration])
}
