/**
 * AccessoryCardSkeleton Component
 *
 * Loading skeleton for AccessoryCard using BaseSkeleton.
 * Matches the visual structure of the shop's accessory cards.
 *
 * Design Principles:
 * - DRY: Reuses BaseSkeleton and SkeletonPatterns
 * - Single Responsibility: Only defines accessory card skeleton structure
 * - Open/Closed: Extended from BaseSkeleton without modifying it
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { BaseSkeleton, SkeletonPatterns } from './BaseSkeleton'
import Skeleton from 'react-loading-skeleton'

interface AccessoryCardSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number
}

export function AccessoryCardSkeleton ({ count = 1 }: AccessoryCardSkeletonProps): ReactNode {
  return (
    <BaseSkeleton
      count={count}
      wrapperClassName='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
      renderItem={() => (
        <SkeletonPatterns.Card>
          {/* Rarity Badge */}
          <div className='flex items-center justify-between mb-3'>
            <Skeleton width={90} height={24} borderRadius='9999px' />
            <SkeletonPatterns.Circle size={32} />
          </div>

          {/* Accessory Image Area */}
          <SkeletonPatterns.ImageArea aspectRatio='square' />

          {/* Content: Name, Description, Price */}
          <SkeletonPatterns.CardContent />

          {/* Price */}
          <div className='flex items-center gap-2 mt-3'>
            <Skeleton width={80} height={32} />
            <Skeleton circle width={24} height={24} />
          </div>

          {/* Action Button */}
          <div className='mt-4'>
            <SkeletonPatterns.Button width='100%' height={40} />
          </div>
        </SkeletonPatterns.Card>
      )}
    />
  )
}
