'use client'

import { useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface UseConfettiReturn {
  celebrateLevelUp: () => void
  celebrateSimple: () => void
  celebrateFromSides: () => void
  clearConfetti: () => void
}

/**
 * Custom hook for confetti animations
 *
 * Provides reusable confetti effects for celebrations like level-ups.
 * Follows Single Responsibility: manages confetti animations only.
 */
export function useConfetti (): UseConfettiReturn {
  /**
   * Trigger a level-up celebration with confetti
   * Uses gradient colors matching the app theme (#ff8585 to #e89b7f)
   */
  const celebrateLevelUp = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 10000
    }

    function fire (particleRatio: number, opts: confetti.Options): void {
      void confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#ff8585', '#e89b7f', '#ffb3b3', '#f4a582', '#ffd1d1']
      })
    }

    // Multiple bursts for a grand effect
    fire(0.25, {
      spread: 26,
      startVelocity: 55
    })

    fire(0.2, {
      spread: 60
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45
    })
  }, [])

  /**
   * Trigger a simple celebration burst
   * Useful for smaller achievements
   */
  const celebrateSimple = useCallback(() => {
    void confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff8585', '#e89b7f', '#ffb3b3', '#f4a582'],
      zIndex: 10000
    })
  }, [])

  /**
   * Trigger confetti from sides (left and right)
   * Creates a spectacular effect for major achievements
   */
  const celebrateFromSides = useCallback(() => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ['#ff8585', '#e89b7f', '#ffb3b3', '#f4a582', '#ffd1d1']

    const frame = (): void => {
      void confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        zIndex: 10000
      })

      void confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        zIndex: 10000
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  /**
   * Clear all active confetti animations
   */
  const clearConfetti = useCallback(() => {
    confetti.reset()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      confetti.reset()
    }
  }, [])

  return {
    celebrateLevelUp,
    celebrateSimple,
    celebrateFromSides,
    clearConfetti
  }
}
