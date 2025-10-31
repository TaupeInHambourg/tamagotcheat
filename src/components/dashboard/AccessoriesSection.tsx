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
import Button from '../Button'

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
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h2 className='text-2xl font-black text-chestnut-deep flex items-center gap-2'>
            <span>🎨</span>
            <span>Mes Accessoires</span>
          </h2>
          <p className='text-sm text-chestnut-medium mt-1'>
            Personnalise tes créatures avec style
          </p>
        </div>
        <Link href='/shop'>
          <Button variant='primary' size='sm'>
            <span className='flex items-center gap-2'>
              <span>🛍️</span>
              <span className='hidden sm:inline'>Boutique</span>
            </span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className='grid md:grid-cols-3 gap-4'>
        {/* Collection Count Card */}
        <div className='bg-gradient-to-br from-moss-light/30 to-moss-pastel/30 rounded-xl p-5 text-center ring-1 ring-moss-soft/30 hover:shadow-md transition-all duration-300'>
          <div className='text-4xl mb-2 animate-float'>📦</div>
          <div className='text-3xl font-black text-moss-deep mb-1'>
            {ownedCount}
          </div>
          <p className='text-xs text-chestnut-medium font-medium'>
            Accessoire{ownedCount > 1 ? 's' : ''} possédé{ownedCount > 1 ? 's' : ''}
          </p>
          {ownedCount === 0 && (
            <p className='text-xs text-chestnut-soft mt-2'>
              Commence ta collection !
            </p>
          )}
        </div>

        {/* Rarest Accessory Display */}
        <div className='md:col-span-2 bg-gradient-to-br from-autumn-cream to-autumn-peach/20 rounded-xl p-5 ring-1 ring-autumn-peach/30 hover:shadow-md transition-all duration-300'>
          {rarestAccessory !== undefined
            ? (
              <div className='flex flex-col sm:flex-row items-center gap-4'>
                {/* Accessory Emoji */}
                <div className='flex-shrink-0'>
                  <div className='text-6xl animate-float'>{rarestAccessory.emoji}</div>
                </div>

                {/* Accessory Info */}
                <div className='flex-1 text-center sm:text-left space-y-2'>
                  <div className='flex items-center gap-2 justify-center sm:justify-start flex-wrap'>
                    <h3 className='text-xl font-bold text-chestnut-deep'>
                      {rarestAccessory.name}
                    </h3>
                    <RarityBadge rarity={rarestAccessory.rarity} size='sm' />
                  </div>
                  <p className='text-sm text-chestnut-soft'>
                    {rarestAccessory.description}
                  </p>

                  {/* Acquired Badge */}
                  <div className='flex justify-center sm:justify-start'>
                    <div className='inline-flex items-center gap-2 bg-moss-light/30 px-3 py-1.5 rounded-full shadow-sm ring-1 ring-moss-soft/30'>
                      <span className='text-base'>✨</span>
                      <span className='text-xs font-bold text-moss-deep'>
                        Accessoire le plus rare
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              )
            : (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <div className='text-6xl mb-3 animate-float'>🛍️</div>
                <h3 className='text-xl font-bold text-chestnut-deep mb-2'>
                  Aucun accessoire possédé
                </h3>
                <p className='text-sm text-chestnut-soft mb-4 max-w-md'>
                  Visite la boutique pour découvrir une collection d'accessoires uniques et personnaliser tes créatures !
                </p>
                <Link href='/shop'>
                  <Button variant='primary' size='md'>
                    <span className='flex items-center gap-2'>
                      <span>🎨</span>
                      <span>Explorer la boutique</span>
                    </span>
                  </Button>
                </Link>
              </div>
              )}
        </div>
      </div>

      {/* Inventory Section */}
      <div className='mt-6'>
        <h3 className='text-lg font-bold text-chestnut-deep mb-4 flex items-center gap-2'>
          <span>📦</span>
          <span>Inventaire</span>
        </h3>

        {sortedAccessories.length === 0
          ? (
            <div className='bg-gradient-to-r from-pastel-sky/30 to-pastel-mint/30 rounded-xl p-6 ring-1 ring-moss-pastel/30 text-center'>
              <span className='text-4xl mb-2 inline-block'>🎁</span>
              <p className='text-sm font-medium text-chestnut-medium'>
                Votre inventaire est vide
              </p>
              <p className='text-xs text-chestnut-soft mt-1'>
                Visitez la boutique pour acquérir vos premiers accessoires !
              </p>
            </div>
            )
          : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
              {sortedAccessories.map((accessory) => (
                <div
                  key={accessory._id}
                  className='bg-gradient-to-br from-white to-autumn-cream rounded-xl p-4 ring-1 ring-slate-200/50 hover:shadow-md hover:ring-autumn-coral/40 transition-all duration-300 flex flex-col items-center gap-2'
                >
                  <div className='text-4xl'>{accessory.emoji}</div>
                  <p className='text-xs font-bold text-chestnut-dark text-center line-clamp-2'>
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
