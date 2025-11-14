/**
 * AccessoriesSection Component
 *
 * Dashboard section for displaying user's accessory collection.
 * Shows owned accessories count and inventory sorted by rarity.
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ACCESSORIES_CATALOG } from '@/config/accessories.config'
import type { OwnedAccessory } from '@/types/accessory.types'
import RarityBadge from '../accessories/RarityBadge'
import Button from '@/components/Button'

interface AccessoriesSectionProps {
  /** User's owned accessories */
  accessories: OwnedAccessory[]
}

// Rarity order for sorting (highest to lowest)
const RARITY_ORDER: Record<string, number> = {
  legendary: 4,
  epic: 3,
  rare: 2,
  common: 1
}

export default function AccessoriesSection ({
  accessories
}: AccessoriesSectionProps): ReactNode {
  const ownedCount = accessories.length

  // Enrich owned accessories with catalog data
  const enrichedAccessories = accessories
    .map(owned => {
      const catalogItem = ACCESSORIES_CATALOG.find(acc => acc.id === owned.accessoryId)
      if (catalogItem === undefined) return null
      return {
        ...owned,
        ...catalogItem
      }
    })
    .filter((acc): acc is NonNullable<typeof acc> => acc !== null)

  // Sort accessories by rarity (highest first)
  const sortedAccessories = enrichedAccessories.sort((a, b) => {
    const rarityA = RARITY_ORDER[a.rarity] ?? 0
    const rarityB = RARITY_ORDER[b.rarity] ?? 0
    return rarityB - rarityA
  })

  // Get rarest accessory owned by user
  const rarestAccessory = sortedAccessories[0]

  return (
    <section className='card-cozy'>
      {/* Header - Plus compact sur mobile */}
      <div className='flex items-center justify-between mb-3 sm:mb-4'>
        <div>
          <h2 className='text-lg sm:text-xl lg:text-2xl font-bold' style={{ color: '#a65d47' }}>
            Mes Accessoires
          </h2>
          <p className='text-[11px] sm:text-xs lg:text-sm text-chestnut-medium mt-1'>
            Personnalise tes créatures avec style
          </p>
        </div>
        <Link href='/shop'>
          <Button variant='primary' size='sm' className='touch-manipulation active:scale-95'>
            <span className='flex items-center gap-1 sm:gap-1.5'>
              <span className='text-base sm:text-lg'>🛍️</span>
              <span className='hidden sm:inline text-xs sm:text-sm'>Boutique</span>
            </span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid - Meilleure répartition mobile */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'>
        {/* Collection Count Card */}
        <div className='bg-gradient-to-br from-moss-light/30 to-moss-pastel/30 rounded-xl p-3 sm:p-4 lg:p-5 text-center ring-1 ring-moss-soft/30 hover:shadow-md transition-all duration-300 active:scale-[0.98] touch-manipulation'>
          <div className='text-2xl sm:text-3xl lg:text-4xl mb-1.5 sm:mb-2 animate-float'>📦</div>
          <div className='text-xl sm:text-2xl lg:text-3xl font-black text-moss-deep mb-0.5 sm:mb-1'>
            {ownedCount}
          </div>
          <p className='text-[10px] sm:text-xs text-chestnut-medium font-medium'>
            Accessoire{ownedCount > 1 ? 's' : ''} possédé{ownedCount > 1 ? 's' : ''}
          </p>
          {ownedCount === 0 && (
            <p className='text-[10px] sm:text-xs text-chestnut-soft mt-1 sm:mt-2'>
              Commence ta collection !
            </p>
          )}
        </div>

        {/* Rarest Accessory Display - Optimisé pour mobile */}
        <div className='sm:col-span-1 md:col-span-2 bg-gradient-to-br from-autumn-cream to-autumn-peach/20 rounded-xl p-3 sm:p-4 lg:p-5 ring-1 ring-autumn-peach/30 hover:shadow-md transition-all duration-300 active:scale-[0.98] touch-manipulation'>
          {rarestAccessory !== undefined
            ? (
              <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3 lg:gap-4'>
                {/* Accessory Emoji */}
                <div className='flex-shrink-0'>
                  <div className='text-4xl sm:text-5xl lg:text-6xl animate-float'>{rarestAccessory.emoji}</div>
                </div>

                {/* Accessory Info */}
                <div className='flex-1 text-center sm:text-left space-y-1.5 sm:space-y-2'>
                  <div className='flex items-center gap-1.5 sm:gap-2 justify-center sm:justify-start flex-wrap'>
                    <h3 className='text-base sm:text-lg lg:text-xl font-bold text-chestnut-deep'>
                      {rarestAccessory.name}
                    </h3>
                    <RarityBadge rarity={rarestAccessory.rarity} size='sm' />
                  </div>
                  <p className='text-[11px] sm:text-xs lg:text-sm text-chestnut-soft leading-relaxed'>
                    {rarestAccessory.description}
                  </p>

                  {/* Acquired Badge */}
                  <div className='flex justify-center sm:justify-start pt-1'>
                    <div className='inline-flex items-center gap-1 sm:gap-1.5 bg-moss-light/30 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm ring-1 ring-moss-soft/30'>
                      <span className='text-xs sm:text-sm'>✨</span>
                      <span className='text-[10px] sm:text-xs font-bold text-moss-deep'>
                        Accessoire le plus rare
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              )
            : (
              <div className='flex flex-col items-center justify-center py-4 sm:py-6 lg:py-8 text-center'>
                <div className='text-4xl sm:text-5xl lg:text-6xl mb-1.5 sm:mb-2 lg:mb-3 animate-float'>🛍️</div>
                <h3 className='text-base sm:text-lg lg:text-xl font-bold text-chestnut-deep mb-1.5 sm:mb-2'>
                  Aucun accessoire possédé
                </h3>
                <p className='text-[11px] sm:text-xs lg:text-sm text-chestnut-soft mb-2 sm:mb-3 lg:mb-4 max-w-md px-2'>
                  Visite la boutique pour découvrir une collection d'accessoires uniques et personnaliser tes créatures !
                </p>
                <Link href='/shop'>
                  <Button variant='primary' size='sm' className='sm:size-md touch-manipulation active:scale-95'>
                    <span className='flex items-center gap-1.5 sm:gap-2'>
                      <span>🎨</span>
                      <span className='text-xs sm:text-sm'>Explorer la boutique</span>
                    </span>
                  </Button>
                </Link>
              </div>
              )}
        </div>
      </div>

      {/* Inventory Section - Optimisé pour mobile */}
      <div className='mt-12 sm:mt-14 lg:mt-16'>
        <h2 className='text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4' style={{ color: '#a65d47' }}>
          Inventaire
        </h2>

        {sortedAccessories.length === 0
          ? (
            <div className='bg-gradient-to-r from-pastel-sky/30 to-pastel-mint/30 rounded-xl p-3 sm:p-4 lg:p-6 ring-1 ring-moss-pastel/30 text-center'>
              <span className='text-2xl sm:text-3xl lg:text-4xl mb-1.5 sm:mb-2 inline-block'>🎁</span>
              <p className='text-xs sm:text-sm font-medium text-chestnut-medium'>
                Votre inventaire est vide
              </p>
              <p className='text-[11px] sm:text-xs text-chestnut-soft mt-0.5 sm:mt-1'>
                Visitez la boutique pour acquérir vos premiers accessoires !
              </p>
            </div>
            )
          : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3'>
              {sortedAccessories.map((accessory) => (
                <div
                  key={accessory._id}
                  className='bg-gradient-to-br from-white to-autumn-cream rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 ring-1 ring-slate-200/50 hover:shadow-md hover:ring-autumn-coral/40 transition-all duration-300 active:scale-95 touch-manipulation flex flex-col items-center gap-1.5 sm:gap-2'
                >
                  <div className='text-2xl sm:text-3xl lg:text-4xl'>{accessory.emoji}</div>
                  <p className='text-[10px] sm:text-xs font-bold text-chestnut-dark text-center line-clamp-2'>
                    {accessory.name}
                  </p>
                  <RarityBadge rarity={accessory.rarity} size='sm' />
                </div>
              ))}
            </div>
            )}
      </div>
    </section>
  )
}
