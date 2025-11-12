/**
 * Page Loader Component
 *
 * Simple, consistent loading indicator for page transitions.
 * Shows only during initial page load, not for component-level loading.
 *
 * Design Principles:
 * - Single Responsibility: Only displays page loading state
 * - Clean Code: Simple, readable, maintainable
 * - Consistent UX: Same loading experience across all pages
 *
 * @component
 */

import type { ReactNode } from 'react'

/**
 * Centered page loader with autumn theme
 */
export function PageLoader (): ReactNode {
  return (
    <div className='min-h-screen flex items-center justify-center bg-autumn-gradient'>
      <div className='text-center'>
        <div className='text-6xl mb-4 animate-bounce'>🍂</div>
        <p className='text-chestnut-deep font-semibold text-lg'>Chargement...</p>
      </div>
    </div>
  )
}
