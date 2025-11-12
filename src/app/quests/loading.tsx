/**
 * Quests Page Loading State
 *
 * Displays skeleton loaders while quests data is being fetched.
 * Uses Next.js App Router loading.tsx convention for automatic Suspense boundary.
 *
 * Design Principles:
 * - Single Responsibility: Only handles loading UI for quests page
 * - Matches the layout structure of the actual quests page
 *
 * @page
 */

import { AppLayout } from '@/components/navigation'
import { QuestCardSkeleton } from '@/components/skeletons'
import Skeleton from 'react-loading-skeleton'

export default function QuestsLoading (): React.ReactNode {
  return (
    <AppLayout>
      <div className='py-8 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8 sm:mb-10 lg:mb-12'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
              Quêtes 🏆
            </h1>
            <p className='text-lg sm:text-xl text-chestnut-medium leading-relaxed'>
              Complète des quêtes pour gagner des récompenses !
            </p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8'>
            <div className='card-cozy text-center'>
              <Skeleton circle width={48} height={48} className='mx-auto mb-2' />
              <Skeleton width={80} height={32} className='mx-auto mb-1' />
              <Skeleton width={120} height={16} className='mx-auto' />
            </div>
            <div className='card-cozy text-center'>
              <Skeleton circle width={48} height={48} className='mx-auto mb-2' />
              <Skeleton width={80} height={32} className='mx-auto mb-1' />
              <Skeleton width={120} height={16} className='mx-auto' />
            </div>
            <div className='card-cozy text-center'>
              <Skeleton circle width={48} height={48} className='mx-auto mb-2' />
              <Skeleton width={80} height={32} className='mx-auto mb-1' />
              <Skeleton width={120} height={16} className='mx-auto' />
            </div>
          </div>

          {/* Quests Section */}
          <div className='card-cozy p-6 sm:p-8'>
            <div className='mb-6'>
              <Skeleton width={200} height={32} />
              <Skeleton width={300} height={20} className='mt-2' />
            </div>
            <div className='space-y-4'>
              <QuestCardSkeleton count={5} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
