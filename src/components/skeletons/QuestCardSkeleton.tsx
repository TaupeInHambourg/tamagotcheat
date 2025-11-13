/**
 * QuestCardSkeleton Component
 *
 * Loading skeleton for Quest cards using BaseSkeleton.
 * Matches the visual structure of quest display cards.
 *
 * Design Principles:
 * - DRY: Reuses BaseSkeleton and SkeletonPatterns
 * - Single Responsibility: Only defines quest card skeleton structure
 * - Open/Closed: Extended from BaseSkeleton without modifying it
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { BaseSkeleton, SkeletonPatterns } from './BaseSkeleton'
import Skeleton from 'react-loading-skeleton'

interface QuestCardSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number
}

export function QuestCardSkeleton ({ count = 1 }: QuestCardSkeletonProps): ReactNode {
  return (
    <BaseSkeleton
      count={count}
      renderItem={() => (
        <SkeletonPatterns.Card>
          <div className='flex items-start justify-between gap-4 mb-4'>
            {/* Left: Icon and Info */}
            <div className='flex items-start gap-3 flex-1'>
              <SkeletonPatterns.Circle size={48} />
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
          <SkeletonPatterns.Button width='100%' height={44} />
        </SkeletonPatterns.Card>
      )}
    />
  )
}
