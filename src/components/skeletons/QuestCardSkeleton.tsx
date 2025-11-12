/**
 * QuestCardSkeleton Component
 *
 * Loading skeleton for Quest cards in dashboard and quest pages.
 * Matches the visual structure of quest display cards.
 *
 * Design Principles:
 * - Single Responsibility: Only displays loading state for quest cards
 * - Open/Closed: Standalone component that doesn't need modification
 * - Interface Segregation: Simple, focused props interface
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'

interface QuestCardSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number
}

/**
 * Skeleton loader matching Quest card structure
 *
 * Visual structure:
 * - Card container with padding
 * - Left section: Quest icon and info
 * - Right section: Progress and reward
 * - Bottom section: Action button
 */
function QuestCardSkeletonItem (): ReactNode {
  return (
    <div className='bg-white rounded-2xl p-4 sm:p-5 shadow-md ring-1 ring-chestnut-light/20'>
      <div className='flex items-start justify-between gap-4 mb-4'>
        {/* Left: Icon and Info */}
        <div className='flex items-start gap-3 flex-1'>
          <Skeleton circle width={48} height={48} />
          <div className='flex-1 space-y-2'>
            <Skeleton width='80%' height={24} />
            <Skeleton width='100%' height={20} />
          </div>
        </div>

        {/* Right: Reward Badge */}
        <Skeleton width={100} height={32} borderRadius='9999px' />
      </div>

      {/* Progress Section */}
      <div className='mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
        </div>
        <Skeleton width='100%' height={8} borderRadius='9999px' />
      </div>

      {/* Action Button */}
      <Skeleton width='100%' height={44} borderRadius='0.75rem' />
    </div>
  )
}

export function QuestCardSkeleton ({
  count = 1
}: QuestCardSkeletonProps): ReactNode {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <QuestCardSkeletonItem key={index} />
      ))}
    </>
  )
}
