/**
 * Creatures Page Loading State
 *
 * Displays skeleton loaders while creatures data is being fetched.
 * Uses Next.js App Router loading.tsx convention for automatic Suspense boundary.
 *
 * Design Principles:
 * - Single Responsibility: Only handles loading UI for creatures page
 * - Matches the layout structure of the actual creatures page
 *
 * @page
 */

import { AppLayout } from '@/components/navigation'
import { MonsterCardSkeleton } from '@/components/skeletons'
import Skeleton from 'react-loading-skeleton'

export default function CreaturesLoading (): React.ReactNode {
  return (
    <AppLayout>
      <div className='py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8 sm:mb-10 lg:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6'>
            <div>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
                Mes Créatures 🐾
              </h1>
              <p className='text-base sm:text-lg lg:text-xl text-chestnut-medium leading-relaxed'>
                Retrouve toutes tes créatures adorables ici !
              </p>
            </div>
            <Skeleton width={180} height={44} borderRadius='0.75rem' />
          </div>

          {/* Creatures Grid */}
          <div className='space-y-4 sm:space-y-6'>
            <div className='space-y-2'>
              <Skeleton width={250} height={28} />
              <Skeleton width={400} height={20} />
            </div>
            <div className='grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
              <MonsterCardSkeleton count={6} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
