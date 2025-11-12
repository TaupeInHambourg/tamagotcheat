/**
 * Dashboard Page Loading State
 *
 * Displays skeleton loaders while dashboard data is being fetched.
 * Uses Next.js App Router loading.tsx convention for automatic Suspense boundary.
 *
 * Design Principles:
 * - Single Responsibility: Only handles loading UI for dashboard page
 * - Matches the layout structure of the actual dashboard
 *
 * @page
 */

import { AppLayout } from '@/components/navigation'
import { StatsCardSkeleton, MonsterCardSkeleton, QuestCardSkeleton } from '@/components/skeletons'
import Skeleton from 'react-loading-skeleton'

export default function DashboardLoading (): React.ReactNode {
  return (
    <AppLayout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
          <div className='space-y-2'>
            <Skeleton width={300} height={36} />
            <Skeleton width={200} height={20} />
          </div>
          <div className='flex gap-2 sm:gap-3'>
            <Skeleton width={140} height={44} borderRadius='0.75rem' />
            <Skeleton width={100} height={44} borderRadius='0.75rem' />
          </div>
        </div>

        {/* Stats Section */}
        <div className='mt-6 sm:mt-8'>
          <StatsCardSkeleton />
        </div>

        {/* Monsters Section */}
        <section className='mt-8 sm:mt-10 lg:mt-12 space-y-6'>
          <div className='space-y-2'>
            <Skeleton width={250} height={32} />
            <Skeleton width={400} height={20} />
          </div>
          <div className='grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
            <MonsterCardSkeleton count={3} />
          </div>
        </section>

        {/* Quests Section */}
        <section className='mt-8 sm:mt-10 lg:mt-12'>
          <div className='card-cozy p-6 sm:p-8'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <div className='text-4xl'>🏆</div>
                <Skeleton width={200} height={28} />
              </div>
            </div>
            <div className='space-y-4'>
              <QuestCardSkeleton count={3} />
            </div>
          </div>
        </section>

        {/* Accessories Section */}
        <section className='mt-8 sm:mt-10 lg:mt-12'>
          <div className='card-cozy'>
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
              <div>
                <Skeleton width={200} height={28} />
                <Skeleton width={250} height={16} className='mt-1' />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-gradient-to-br from-moss-light/30 to-moss-pastel/30 rounded-xl p-4 sm:p-5 text-center ring-1 ring-moss-soft/30'>
                <Skeleton circle width={48} height={48} className='mx-auto mb-2' />
                <Skeleton width={60} height={36} className='mx-auto mb-1' />
                <Skeleton width={120} height={16} className='mx-auto' />
              </div>
              <div className='md:col-span-2 bg-gradient-to-br from-autumn-cream to-autumn-peach/20 rounded-xl p-4 sm:p-5 ring-1 ring-autumn-peach/30'>
                <Skeleton width='100%' height={120} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
