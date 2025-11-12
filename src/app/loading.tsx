/**
 * Home Page Loading State
 *
 * Displays skeleton loaders while home page content is being fetched.
 * Uses Next.js App Router loading.tsx convention for automatic Suspense boundary.
 *
 * Design Principles:
 * - Single Responsibility: Only handles loading UI for home page
 * - Matches the layout structure of the actual home page
 *
 * @page
 */

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Skeleton from 'react-loading-skeleton'

export default function HomeLoading (): React.ReactNode {
  return (
    <div className='bg-gradient-to-br from-autumn-cream via-autumn-peach/20 to-moss-light min-h-screen'>
      <Header />
      <main>
        {/* Hero Section Skeleton */}
        <section className='py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto text-center'>
            <Skeleton width='80%' height={64} className='mx-auto mb-6' />
            <Skeleton width='60%' height={28} className='mx-auto mb-8' />
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Skeleton width={180} height={56} borderRadius='0.75rem' />
              <Skeleton width={180} height={56} borderRadius='0.75rem' />
            </div>
          </div>
        </section>

        {/* Features Section Skeleton */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-12'>
              <Skeleton width={300} height={40} className='mx-auto mb-4' />
              <Skeleton width={500} height={24} className='mx-auto' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className='card-cozy text-center'>
                  <Skeleton circle width={64} height={64} className='mx-auto mb-4' />
                  <Skeleton width={150} height={24} className='mx-auto mb-2' />
                  <Skeleton count={2} className='mb-1' />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monsters Showcase Skeleton */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-12'>
              <Skeleton width={350} height={40} className='mx-auto mb-4' />
              <Skeleton width={450} height={24} className='mx-auto' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className='card-creature'>
                  <Skeleton width='100%' height={200} className='mb-4' />
                  <Skeleton width='80%' height={24} className='mx-auto mb-2' />
                  <Skeleton width='60%' height={20} className='mx-auto' />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actions Section Skeleton */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-12'>
              <Skeleton width={300} height={40} className='mx-auto mb-4' />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6'>
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className='card-cozy text-center'>
                  <Skeleton circle width={48} height={48} className='mx-auto mb-2' />
                  <Skeleton width='80%' height={20} className='mx-auto' />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section Skeleton */}
        <section className='py-16 sm:py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl mx-auto text-center'>
            <Skeleton width={300} height={40} className='mx-auto mb-4' />
            <Skeleton width='100%' height={24} className='mx-auto mb-6' />
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Skeleton width={300} height={48} borderRadius='0.75rem' />
              <Skeleton width={150} height={48} borderRadius='0.75rem' />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
