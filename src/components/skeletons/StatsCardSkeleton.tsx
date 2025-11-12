/**
 * StatsCardSkeleton Component
 *
 * Loading skeleton for statistics cards in dashboard.
 * Matches the visual structure of dashboard stat cards.
 *
 * Design Principles:
 * - Single Responsibility: Only displays loading state for stats cards
 * - Open/Closed: Standalone component that doesn't need modification
 * - Interface Segregation: Simple, focused props interface
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'

/**
 * Skeleton loader matching StatsCard structure
 *
 * Visual structure:
 * - Grid of stat cards
 * - Each card: Icon, value, and label
 */
export function StatsCardSkeleton (): ReactNode {
  return (
    <div className='card-cozy'>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6'>
        {/* Total Creatures */}
        <div className='text-center space-y-2'>
          <Skeleton circle width={48} height={48} className='mx-auto' />
          <Skeleton width={60} height={32} className='mx-auto' />
          <Skeleton width={80} height={16} className='mx-auto' />
        </div>

        {/* Average Level */}
        <div className='text-center space-y-2'>
          <Skeleton circle width={48} height={48} className='mx-auto' />
          <Skeleton width={60} height={32} className='mx-auto' />
          <Skeleton width={80} height={16} className='mx-auto' />
        </div>

        {/* Total XP */}
        <div className='text-center space-y-2'>
          <Skeleton circle width={48} height={48} className='mx-auto' />
          <Skeleton width={60} height={32} className='mx-auto' />
          <Skeleton width={80} height={16} className='mx-auto' />
        </div>

        {/* Happiness Score */}
        <div className='text-center space-y-2'>
          <Skeleton circle width={48} height={48} className='mx-auto' />
          <Skeleton width={60} height={32} className='mx-auto' />
          <Skeleton width={80} height={16} className='mx-auto' />
        </div>
      </div>
    </div>
  )
}
