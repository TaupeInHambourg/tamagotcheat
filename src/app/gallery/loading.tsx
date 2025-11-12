/**
 * Gallery Page Loading State
 *
 * Displays skeleton loaders while gallery data is being fetched.
 * Uses Next.js App Router loading.tsx convention for automatic Suspense boundary.
 *
 * Design Principles:
 * - Single Responsibility: Only handles loading UI for gallery page
 * - Matches the layout structure of the actual gallery page
 *
 * @page
 */

import { AppLayout } from '@/components/navigation'
import { MonsterCardSkeleton } from '@/components/skeletons'

export default function GalleryLoading (): React.ReactNode {
  return (
    <AppLayout>
      <div className='py-8 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='mb-8 sm:mb-10 lg:mb-12'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
              Galerie Publique 🌍
            </h1>
            <p className='text-lg sm:text-xl text-chestnut-medium leading-relaxed'>
              Découvre les créatures adorables de notre communauté !
            </p>
          </div>

          {/* Gallery Grid with Skeletons */}
          <div className='grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
            <MonsterCardSkeleton count={6} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
