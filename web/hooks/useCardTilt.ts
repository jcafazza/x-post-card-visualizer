'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CARD_TILT_MAX_DEG,
  CARD_TILT_LIFT_PX,
  CARD_TILT_SMOOTHING,
  CARD_TILT_SMOOTHING_MOBILE,
  CARD_TILT_TOUCH_MAX_NORM,
} from '@/constants/ui'

export interface CardTiltState {
  rotateX: number
  rotateY: number
  lift: number
  /** 0–1, for radial shimmer position X (center = 0.5) */
  shimmerX: number
  /** 0–1, for radial shimmer position Y (center = 0.5) */
  shimmerY: number
}

const ZERO: CardTiltState = {
  rotateX: 0,
  rotateY: 0,
  lift: 0,
  shimmerX: 0.5,
  shimmerY: 0.5,
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Detect if we likely have pointer (mouse) as primary input. */
function isPointerPrimary(): boolean {
  if (typeof window === 'undefined') return true
  return !('ontouchstart' in window) || window.matchMedia('(pointer: fine)').matches
}

/**
 * Tilt and shimmer state for lockLayout cards (share / mobile placeholder).
 * Desktop: cursor position; mobile: deviceorientation with touch-drag fallback. Respects prefers-reduced-motion.
 */
export function useCardTilt(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
): CardTiltState & {
  onMouseMove: (e: React.MouseEvent) => void
  onMouseLeave: () => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
} {
  const [state, setState] = useState<CardTiltState>(ZERO)

  const targetRef = useRef<CardTiltState>({ ...ZERO })
  const currentRef = useRef<CardTiltState>({ ...ZERO })
  const rafRef = useRef<number | null>(null)
  const touchStartRef = useRef<{ x: number; y: number; tiltX: number; tiltY: number } | null>(null)
  const usingOrientationRef = useRef(false)
  const isPointerRef = useRef(true)

  const tick = useCallback(() => {
    rafRef.current = null
    const target = targetRef.current
    const current = currentRef.current
    const smoothing = isPointerRef.current ? CARD_TILT_SMOOTHING : CARD_TILT_SMOOTHING_MOBILE
    const t = smoothing

    const next: CardTiltState = {
      rotateX: lerp(current.rotateX, target.rotateX, t),
      rotateY: lerp(current.rotateY, target.rotateY, t),
      lift: lerp(current.lift, target.lift, t),
      shimmerX: lerp(current.shimmerX, target.shimmerX, t),
      shimmerY: lerp(current.shimmerY, target.shimmerY, t),
    }
    currentRef.current = next
    setState(next)

    const stillMoving =
      Math.abs(next.rotateX - target.rotateX) > 0.001 ||
      Math.abs(next.rotateY - target.rotateY) > 0.001 ||
      Math.abs(next.lift - target.lift) > 0.01
    if (stillMoving) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [])

  const scheduleTick = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [tick])

  const setTarget = useCallback(
    (rotateX: number, rotateY: number, lift: number, shimmerX: number, shimmerY: number) => {
      targetRef.current = {
        rotateX,
        rotateY,
        lift,
        shimmerX,
        shimmerY,
      }
      scheduleTick()
    },
    [scheduleTick]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !containerRef.current) return
      const el = containerRef.current
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const normX = Math.max(-1, Math.min(1, x * 2 - 1))
      const normY = Math.max(-1, Math.min(1, y * 2 - 1))
      setTarget(
        -normY * CARD_TILT_MAX_DEG,
        normX * CARD_TILT_MAX_DEG,
        CARD_TILT_LIFT_PX,
        0.5 + normX * 0.5,
        0.5 + normY * 0.5
      )
    },
    [enabled, containerRef, setTarget]
  )

  const onMouseLeave = useCallback(() => {
    if (!enabled) return
    targetRef.current = { ...ZERO }
    scheduleTick()
  }, [enabled, scheduleTick])

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !containerRef.current || e.touches.length === 0) return
      const t = e.touches[0]
      touchStartRef.current = {
        x: t.clientX,
        y: t.clientY,
        tiltX: currentRef.current.rotateX,
        tiltY: currentRef.current.rotateY,
      }
    },
    [enabled, containerRef]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !containerRef.current || e.touches.length === 0 || !touchStartRef.current) return
      if (usingOrientationRef.current) return
      const start = touchStartRef.current
      const t = e.touches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      const rect = containerRef.current.getBoundingClientRect()
      const normX = Math.max(-1, Math.min(1, (dx / rect.width) * 2))
      const normY = Math.max(-1, Math.min(1, (dy / rect.height) * 2))
      const tiltX = -normY * CARD_TILT_MAX_DEG * CARD_TILT_TOUCH_MAX_NORM * 2
      const tiltY = normX * CARD_TILT_MAX_DEG * CARD_TILT_TOUCH_MAX_NORM * 2
      const sx = 0.5 + normX * 0.5
      const sy = 0.5 + normY * 0.5
      setTarget(tiltX, tiltY, CARD_TILT_LIFT_PX, sx, sy)
    },
    [enabled, containerRef, setTarget]
  )

  const onTouchEnd = useCallback(() => {
    touchStartRef.current = null
    if (!enabled) return
    targetRef.current = { ...ZERO }
    scheduleTick()
  }, [enabled, scheduleTick])

  useEffect(() => {
    isPointerRef.current = isPointerPrimary()
  }, [])

  useEffect(() => {
    if (!enabled) {
      targetRef.current = { ...ZERO }
      currentRef.current = { ...ZERO }
      setState(ZERO)
      return
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e
      if (beta == null || gamma == null) return
      usingOrientationRef.current = true
      const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v))
      const tiltX = clamp((beta - 45) / 30, 1) * CARD_TILT_MAX_DEG
      const tiltY = clamp(gamma / 30, 1) * CARD_TILT_MAX_DEG
      const shimmerX = 0.5 + (gamma / 90) * 0.5
      const shimmerY = 0.5 + ((beta - 45) / 90) * 0.5
      setTarget(tiltX, tiltY, CARD_TILT_LIFT_PX, shimmerX, shimmerY)
    }
    window.addEventListener('deviceorientation', handleOrientation as EventListener)
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener)
      usingOrientationRef.current = false
    }
  }, [enabled, setTarget])

  return {
    ...state,
    onMouseMove,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
