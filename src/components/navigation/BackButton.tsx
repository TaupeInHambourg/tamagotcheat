/**
 * BackButton Component
 *
 * Navigation button for going back to the previous page.
 * Follows mobile-first design principles with responsive styling.
 *
 * Design Principles:
 * - Single Responsibility: Only handles back navigation
 * - Open/Closed: Can be extended with custom behavior via props
 * - Interface Segregation: Simple, focused props interface
 * - Dependency Inversion: Depends on Next.js router abstraction
 *
 * Features:
 * - Browser history navigation
 * - Fallback to home if no history
 * - Accessible with ARIA labels
 * - Responsive sizing
 * - Touch-friendly on mobile
 *
 * @component
 */

'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import Button from '../Button'

interface BackButtonProps {
  /** Fallback URL if no history (default: '/dashboard') */
  fallbackUrl?: string
  /** Custom label for accessibility */
  ariaLabel?: string
  /** Custom click handler (overrides default behavior) */
  onClick?: () => void
}

/**
 * Back button component with browser history navigation
 *
 * @example
 * ```tsx
 * <BackButton />
 * <BackButton fallbackUrl="/home" />
 * <BackButton onClick={customHandler} />
 * ```
 */
export function BackButton ({
  fallbackUrl = '/dashboard',
  ariaLabel = 'Retour à la page précédente',
  onClick
}: BackButtonProps): ReactNode {
  const router = useRouter()

  /**
   * Handles back navigation
   * - Uses custom onClick if provided
   * - Otherwise uses browser history
   * - Falls back to fallbackUrl if no history
   */
  const handleBack = (): void => {
    if (onClick !== undefined) {
      onClick()
      return
    }

    // Check if we can go back in history
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to specified URL
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      onClick={handleBack}
      variant='outline'
      size='md'
      ariaLabel={ariaLabel}
    >
      <span className='text-l sm:text-l' aria-hidden='true'>
        🡠
      </span>
    </Button>
  )
}

/**
 * Compact version for mobile navigation bars
 */
export function BackButtonCompact ({
  fallbackUrl = '/dashboard',
  ariaLabel = 'Retour',
  onClick
}: BackButtonProps): ReactNode {
  const router = useRouter()

  const handleBack = (): void => {
    if (onClick !== undefined) {
      onClick()
      return
    }

    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <button
      onClick={handleBack}
      aria-label={ariaLabel}
      className='
        flex items-center gap-1
        px-3 py-2
        rounded-lg
        text-sm font-semibold
        text-chestnut-medium
        hover:text-chestnut-deep
        hover:bg-autumn-cream/50
        transition-all duration-200
        touch-manipulation
      '
    >
      <span className='text-lg' aria-hidden='true'>
        ←
      </span>
      <span className='hidden sm:inline'>Retour</span>
    </button>
  )
}
