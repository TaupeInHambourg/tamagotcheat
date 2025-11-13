/**
 * StatsCardSkeleton Component
 *
 * Loading skeleton for statistics cards using BaseSkeleton.
 * Matches the visual structure of dashboard stat cards.
 *
 * Design Principles:
 * - DRY: Reuses BaseSkeleton and SkeletonPatterns
 * - Single Responsibility: Only defines stats card skeleton structure
 * - Open/Closed: Extended from BaseSkeleton without modifying it
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { SkeletonPatterns } from './BaseSkeleton'
import Skeleton from 'react-loading-skeleton'

export function StatsCardSkeleton (): ReactNode {
  return (
    <div className='card-cozy'>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6'>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className='text-center space-y-2'>
            <SkeletonPatterns.Circle size={48} />
            <Skeleton width={60} height={32} className='mx-auto' />
            <Skeleton width={80} height={16} className='mx-auto' />
          </div>
        ))}
      </div>
    </div>
  )
}
