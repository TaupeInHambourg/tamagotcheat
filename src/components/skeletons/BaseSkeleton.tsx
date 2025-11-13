/**
 * BaseSkeleton Component
 *
 * Generic reusable skeleton component.
 * Eliminates duplication across MonsterCardSkeleton, AccessoryCardSkeleton, etc.
 *
 * Design Principles:
 * - Single Responsibility: Display loading state
 * - Open/Closed: Extensible through render props
 * - DRY: Single source of truth for skeleton behavior
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'

export interface BaseSkeletonProps {
  /** Number of skeleton items to render */
  count?: number
  /** Custom render function for each skeleton item */
  renderItem: () => ReactNode
  /** Optional wrapper className */
  wrapperClassName?: string
}

/**
 * Single skeleton item wrapper
 */
function SkeletonItem ({ children }: { children: ReactNode }): ReactNode {
  return children
}

/**
 * Generic skeleton loader with configurable content
 */
export function BaseSkeleton ({
  count = 1,
  renderItem,
  wrapperClassName
}: BaseSkeletonProps): ReactNode {
  if (count === 1) {
    return renderItem()
  }

  return (
    <div className={wrapperClassName}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonItem key={index}>
          {renderItem()}
        </SkeletonItem>
      ))}
    </div>
  )
}

/**
 * Common skeleton patterns for reuse
 */
export const SkeletonPatterns = {
  /** Card skeleton with rounded corners and shadow */
  Card: ({ children }: { children: ReactNode }) => (
    <div className='bg-white rounded-2xl p-4 sm:p-5 shadow-md ring-1 ring-chestnut-light/20'>
      {children}
    </div>
  ),

  /** Header section with badge and level */
  CardHeader: () => (
    <div className='flex items-center justify-between mb-4'>
      <Skeleton width={80} height={24} borderRadius='0.75rem' />
      <Skeleton width={60} height={28} borderRadius='9999px' />
    </div>
  ),

  /** Image placeholder area */
  ImageArea: ({ aspectRatio = 'square' }: { aspectRatio?: 'square' | 'wide' | 'tall' }) => {
    const aspectClass = {
      square: 'aspect-square',
      wide: 'aspect-video',
      tall: 'aspect-[3/4]'
    }[aspectRatio]

    return (
      <div className='relative mb-4'>
        <div className={`${aspectClass} w-full flex items-center justify-center`}>
          <Skeleton width='100%' height='100%' borderRadius='1rem' />
        </div>
      </div>
    )
  },

  /** Text content area with title and description */
  CardContent: () => (
    <div className='space-y-2'>
      <Skeleton width='80%' height={20} />
      <Skeleton width='100%' height={16} />
    </div>
  ),

  /** Footer with multiple items */
  CardFooter: ({ items = 2 }: { items?: number }) => (
    <div className='flex items-center justify-between gap-2 pt-2'>
      {Array.from({ length: items }, (_, index) => (
        <Skeleton key={index} width={60} height={16} />
      ))}
    </div>
  ),

  /** Circle skeleton for avatars or icons */
  Circle: ({ size = 48 }: { size?: number }) => (
    <Skeleton circle width={size} height={size} />
  ),

  /** Button skeleton */
  Button: ({ width = 120, height = 40 }: { width?: number | string, height?: number }) => (
    <Skeleton width={width} height={height} borderRadius='0.75rem' />
  )
}
