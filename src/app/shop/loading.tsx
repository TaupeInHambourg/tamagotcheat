/**
 * Shop Page Loading State
 *
 * Displays skeleton loaders while shop data is being fetched.
 * Uses Next.js App Router loading.tsx convention for automatic Suspense boundary.
 *
 * Design Principles:
 * - Single Responsibility: Only handles loading UI for shop page
 * - Matches the layout structure of the actual shop
 *
 * @page
 */

import { AppLayout } from '@/components/navigation'
import { AccessoryCardSkeleton } from '@/components/skeletons'
import Skeleton from 'react-loading-skeleton'

export default function ShopLoading (): React.ReactNode {
  return (
    <AppLayout>
      <div className='py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8 sm:mb-10 lg:mb-12'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
              Boutique d'Accessoires 🛍️
            </h1>
            <p className='text-base sm:text-lg lg:text-xl text-chestnut-medium leading-relaxed'>
              Personnalise tes créatures avec style ! Découvre notre collection d'accessoires uniques.
            </p>

            {/* Koins balance skeleton */}
            <div className='mt-4'>
              <Skeleton width={200} height={48} borderRadius='9999px' />
            </div>

            <div className='mt-3 sm:mt-4'>
              <Skeleton width={180} height={16} />
            </div>
          </div>

          {/* Filters Section */}
          <div className='flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8'>
            <div className='flex flex-wrap gap-2'>
              <Skeleton width={100} height={36} borderRadius='0.75rem' />
              <Skeleton width={100} height={36} borderRadius='0.75rem' />
              <Skeleton width={100} height={36} borderRadius='0.75rem' />
              <Skeleton width={100} height={36} borderRadius='0.75rem' />
            </div>
            <div className='flex gap-2'>
              <Skeleton width={150} height={36} borderRadius='0.75rem' />
              <Skeleton width={120} height={36} borderRadius='0.75rem' />
            </div>
          </div>

          {/* Accessories Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12'>
            <AccessoryCardSkeleton count={8} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
