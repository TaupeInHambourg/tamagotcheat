/**
 * useMonsterSize Hook
 *
 * Custom hook for responsive monster size calculation.
 * Adjusts monster display size based on window width.
 *
 * Architecture:
 * - Single Responsibility: Only handles size calculation
 * - Performance: Debounces resize events
 * - Clean up: Removes event listener on unmount
 *
 * @module hooks/use-monster-size
 */

import { useState, useEffect } from 'react'

/**
 * Breakpoint configuration for responsive sizing
 */
const SIZE_BREAKPOINTS = {
  mobile: { max: 640, size: 280 },
  small: { max: 768, size: 350 },
  medium: { max: 1024, size: 400 },
  large: { max: Infinity, size: 500 }
} as const

/**
 * Calculate monster size based on window width
 *
 * @param width - Current window width in pixels
 * @returns Appropriate monster size
 */
function calculateMonsterSize (width: number): number {
  if (width < SIZE_BREAKPOINTS.mobile.max) {
    return SIZE_BREAKPOINTS.mobile.size
  }
  if (width < SIZE_BREAKPOINTS.small.max) {
    return SIZE_BREAKPOINTS.small.size
  }
  if (width < SIZE_BREAKPOINTS.medium.max) {
    return SIZE_BREAKPOINTS.medium.size
  }
  return SIZE_BREAKPOINTS.large.size
}

/**
 * Hook to get responsive monster size
 *
 * Listens to window resize events and returns the appropriate
 * monster size based on the current viewport width.
 *
 * @returns Current monster size in pixels
 *
 * @example
 * ```tsx
 * const monsterSize = useMonsterSize()
 * <Monster size={monsterSize} />
 * ```
 */
export function useMonsterSize (): number {
  const [monsterSize, setMonsterSize] = useState(() =>
    typeof window !== 'undefined'
      ? calculateMonsterSize(window.innerWidth)
      : SIZE_BREAKPOINTS.medium.size
  )

  useEffect(() => {
    // Update size on resize
    const updateMonsterSize = (): void => {
      setMonsterSize(calculateMonsterSize(window.innerWidth))
    }

    // Debounce resize events for performance
    let timeoutId: NodeJS.Timeout
    const debouncedUpdate = (): void => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateMonsterSize, 150)
    }

    window.addEventListener('resize', debouncedUpdate)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedUpdate)
    }
  }, [])

  return monsterSize
}
