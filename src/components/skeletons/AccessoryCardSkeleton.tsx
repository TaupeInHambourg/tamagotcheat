/**
 * AccessoryCardSkeleton Component
 *
 * Loading skeleton for AccessoryCard component.
 * Matches the visual structure of the shop's accessory cards.
 *
 * Design Principles:
 * - Single Responsibility: Only displays loading state for accessory cards
 * - Open/Closed: Standalone component that doesn't need modification
 * - Interface Segregation: Simple, focused props interface
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'

interface AccessoryCardSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number
}

/**
 * Skeleton loader matching AccessoryCard structure
 *
 * Visual structure:
 * - Card container with rounded corners
 * - Top section: Rarity badge
 * - Middle section: Accessory image placeholder
 * - Bottom section: Name, category, price
 * - Action button area
 */
function AccessoryCardSkeletonItem (): ReactNode {
  return (
    <div className='bg-white rounded-2xl p-4 sm:p-5 shadow-md ring-1 ring-chestnut-light/20 hover:shadow-lg transition-all duration-300'>
      {/* Rarity Badge */}
      <div className='flex items-center justify-between mb-3'>
        <Skeleton width={90} height={24} borderRadius='9999px' />
        <Skeleton circle width={32} height={32} />
      </div>

      {/* Accessory Image Area */}
      <div className='relative mb-4'>
        <div className='aspect-square w-full flex items-center justify-center bg-gradient-to-br from-autumn-cream to-autumn-peach/30 rounded-xl'>
          <Skeleton width='80%' height='80%' borderRadius='0.5rem' />
        </div>
      </div>

      {/* Accessory Info */}
      <div className='space-y-2 mb-4'>
        <Skeleton width='80%' height={24} />
        <Skeleton width='50%' height={20} />
      </div>

      {/* Price Section */}
      <div className='flex items-center justify-between pt-3 border-t border-chestnut-light/20 mb-3'>
        <Skeleton width={80} height={28} />
        <Skeleton width={60} height={20} />
      </div>

      {/* Action Button */}
      <Skeleton width='100%' height={44} borderRadius='0.75rem' />
    </div>
  )
}

export function AccessoryCardSkeleton ({
  count = 1
}: AccessoryCardSkeletonProps): ReactNode {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <AccessoryCardSkeletonItem key={index} />
      ))}
    </>
  )
}
