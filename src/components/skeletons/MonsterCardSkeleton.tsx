/**
 * MonsterCardSkeleton Component
 *
 * Loading skeleton for MonsterCard component.
 * Matches the visual structure of the actual MonsterCard.
 *
 * Design Principles:
 * - Single Responsibility: Only displays loading state for monster cards
 * - Open/Closed: Standalone component that doesn't need modification
 * - Interface Segregation: Simple, focused props interface
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'

interface MonsterCardSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number
}

/**
 * Skeleton loader matching MonsterCard structure
 *
 * Visual structure:
 * - Card container with rounded corners and shadow
 * - Top section: State badge and level
 * - Middle section: Monster image placeholder
 * - Bottom section: Name and adoption date
 */
function MonsterCardSkeletonItem (): ReactNode {
  return (
    <div className='card-creature p-4 sm:p-5'>
      {/* Header: State Badge & Level */}
      <div className='flex items-center justify-between mb-4'>
        <Skeleton width={80} height={24} borderRadius='0.75rem' />
        <Skeleton width={60} height={28} borderRadius='9999px' />
      </div>

      {/* Monster Image Area */}
      <div className='relative mb-4'>
        <div className='aspect-square w-full flex items-center justify-center'>
          <Skeleton width='100%' height='100%' borderRadius='1rem' />
        </div>
      </div>

      {/* Footer: Name & Date */}
      <div className='space-y-2'>
        <Skeleton width='70%' height={28} />
        <Skeleton width='50%' height={20} />
      </div>

      {/* Owner info (if showOwner) */}
      <div className='mt-3 pt-3 border-t border-chestnut-light/20'>
        <Skeleton width='60%' height={16} />
      </div>
    </div>
  )
}

export function MonsterCardSkeleton ({
  count = 1
}: MonsterCardSkeletonProps): ReactNode {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <MonsterCardSkeletonItem key={index} />
      ))}
    </>
  )
}
