/**
 * Wallet Page Loading State
 *
 * Displays skeleton loaders while wallet data is being fetched.
 * Uses Next.js App Router loading.tsx convention for automatic Suspense boundary.
 *
 * Design Principles:
 * - Single Responsibility: Only handles loading UI for wallet page
 * - Matches the layout structure of the actual wallet page
 *
 * @page
 */

import { AppLayout } from '@/components/navigation'
import Skeleton from 'react-loading-skeleton'

export default function WalletLoading (): React.ReactNode {
  return (
    <AppLayout>
      <div className='py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8 sm:mb-10 lg:mb-12 text-center'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
              Mon Wallet 💰
            </h1>
            <p className='text-base sm:text-lg lg:text-xl text-chestnut-medium leading-relaxed mb-4 sm:mb-6'>
              Gère ta monnaie virtuelle et tes achats
            </p>

            {/* Balance Skeleton */}
            <div className='inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-autumn-cream to-autumn-peach/50 rounded-full px-6 py-3 sm:px-8 sm:py-4 shadow-lg border border-autumn-peach'>
              <span className='text-3xl sm:text-4xl'>💰</span>
              <div className='text-left'>
                <Skeleton width={100} height={32} />
                <Skeleton width={80} height={16} className='mt-1' />
              </div>
            </div>
          </div>

          {/* Packages Grid Skeleton */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className='card-cozy hover:shadow-xl transition-all duration-300'>
                <div className='text-center space-y-4'>
                  <Skeleton circle width={80} height={80} className='mx-auto' />
                  <Skeleton width={120} height={28} className='mx-auto' />
                  <Skeleton width={100} height={32} className='mx-auto' />
                  <Skeleton width='100%' height={48} borderRadius='0.75rem' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
