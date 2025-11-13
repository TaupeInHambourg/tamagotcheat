/**
 * Gallery Page - Public Monster Gallery
 *
 * Displays all public monsters from all users in a gallery format.
 * This page is accessible to everyone (no authentication required).
 *
 * Features:
 * - Shows all monsters marked as public
 * - Displays monster visuals with accessories
 * - Shows owner names
 * - Read-only view (no interactions)
 *
 * Architecture:
 * - Server component for initial data fetching
 * - Client components for interactive elements
 * - Follows clean architecture principles
 *
 * @async
 * @returns {Promise<React.ReactNode>} The gallery page content
 */

import { getPublicMonsters } from '@/actions/monsters.actions'
import { AppLayout } from '@/components/navigation'
import { MonsterCard } from '@/components/monsters/monster-card'
import LandingHeader from '@/components/navigation/LandingHeader'
import { headers } from 'next/headers'

interface Props { searchParams?: { source?: string } }

export default async function GalleryPage ({ searchParams }: Props): Promise<React.ReactNode> {
  const publicMonsters = await getPublicMonsters()

  // Determine the source of navigation. Priority:
  // 1. explicit ?source=landing|dashboard
  // 2. referer header containing '/dashboard'
  // default: 'landing'
  const headerList = await headers()
  const referer = headerList.get('referer') ?? ''
  const explicit = searchParams?.source
  let source: 'landing' | 'dashboard' = 'landing'
  if (explicit === 'dashboard') {
    source = 'dashboard'
  } else if (explicit === 'landing') {
    source = 'landing'
  } else if (referer.includes('/dashboard')) {
    source = 'dashboard'
  }

  const content = (
    <div className='py-8 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 sm:mb-10 lg:mb-12'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
            Galerie Publique 🌍
          </h1>
          <p className='text-lg sm:text-xl text-chestnut-medium leading-relaxed'>
            Découvre les créatures adorables de notre communauté !
          </p>
        </div>

        {/* Gallery Grid */}
        {publicMonsters.length === 0
          ? (
            <div className='text-center py-20 bg-gradient-to-br from-autumn-cream to-autumn-peach/30 rounded-2xl shadow-md border border-autumn-peach'>
              <div className='text-8xl mb-8'>🌟</div>
              <h2 className='text-3xl sm:text-4xl font-bold text-chestnut-deep leading-tight mb-6'>
                Aucune créature publique pour le moment
              </h2>
              <p className='text-xl text-chestnut-medium leading-relaxed mb-8 max-w-md mx-auto'>
                Sois le premier à partager ta créature avec la communauté !
              </p>
              <div className='inline-block'>
                <span className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-autumn-peach text-autumn-brown'>
                  🎨 Crée ta première créature
                </span>
              </div>
            </div>
            )
          : (
            <>
              <div className='mb-6 text-center'>
                <p className='text-lg text-chestnut-medium'>
                  <span className='font-semibold text-chestnut-deep'>{publicMonsters.length}</span>
                  {' '}créature{publicMonsters.length > 1 ? 's' : ''} dans la galerie
                </p>
              </div>

              <div className='grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
                {publicMonsters.map((monster) => {
                  const cardKey = monster.id ?? monster._id ?? monster.name

                  return (
                    <MonsterCard
                      key={cardKey}
                      initialMonster={monster}
                      autoRefresh={false}
                      showOwner
                      isClickable={false}
                    />
                  )
                })}
              </div>
            </>
            )}
      </div>
    </div>
  )

  // Render a different header/layout depending on where the user came from
  if (source === 'dashboard') {
    // keep the App layout (dashboard header + bottom nav)
    return (
      <AppLayout>
        {content}
      </AppLayout>
    )
  }

  // Landing-source: show the landing Header instead
  // add top padding so content isn't hidden behind fixed header
  return (
    <>
      <LandingHeader />
      <div className='pt-28'>
        {content}
      </div>
    </>
  )
}
