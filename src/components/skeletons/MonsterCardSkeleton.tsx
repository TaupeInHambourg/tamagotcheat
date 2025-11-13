/**
 * MonsterCardSkeleton Component
 *
 * Loading skeleton for MonsterCard component using BaseSkeleton.
 * Matches the visual structure of the actual MonsterCard.
 *
 * Design Principles:
 * - DRY: Reuses BaseSkeleton and SkeletonPatterns
 * - Single Responsibility: Only defines monster card skeleton structure
 * - Open/Closed: Extended from BaseSkeleton without modifying it
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { BaseSkeleton, SkeletonPatterns } from './BaseSkeleton'
import Skeleton from 'react-loading-skeleton'

interface MonsterCardSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number
}

export function MonsterCardSkeleton ({ count = 1 }: MonsterCardSkeletonProps): ReactNode {
  return (
    <BaseSkeleton
      count={count}
      renderItem={() => (
        <div className='card-creature p-4 sm:p-5'>
          {/* Header: State Badge & Level */}
          <SkeletonPatterns.CardHeader />

          {/* Monster Image Area */}
          <SkeletonPatterns.ImageArea aspectRatio='square' />

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
      )}
    />
  )
}
