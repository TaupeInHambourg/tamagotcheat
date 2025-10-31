/**
 * AccessoriesSection Component
 *
 * Dashboard section for displaying user's accessory collection.
 * Clean, minimal design matching the app's aesthetic.
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ACCESSORIES_CATALOG, getAccessoryPrice } from '@/config/accessories.config'
import type { Accessory } from '@/types/accessory.types'
import RarityBadge from '../accessories/RarityBadge'
import Button from '../Button'

interface AccessoriesSectionProps {
  /** User's owned accessories count */
  ownedCount?: number
  /** User's rarest accessory */
  rarestAccessory?: Accessory
}

export default function AccessoriesSection ({
  ownedCount = 0,
  rarestAccessory
}: AccessoriesSectionProps): ReactNode {
  // Mock data: show the first legendary accessory if no real data
  const displayAccessory = rarestAccessory ?? ACCESSORIES_CATALOG.find(acc => acc.rarity === 'legendary') ?? ACCESSORIES_CATALOG[0]
  const accessoryPrice = getAccessoryPrice(displayAccessory)

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
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            {/* Accessory Emoji */}
            <div className='flex-shrink-0'>
              <div className='text-6xl animate-float'>{displayAccessory.emoji}</div>
            </div>

            {/* Accessory Info */}
            <div className='flex-1 text-center sm:text-left space-y-2'>
              <div className='flex items-center gap-2 justify-center sm:justify-start flex-wrap'>
                <h3 className='text-xl font-bold text-chestnut-deep'>
                  {displayAccessory.name}
                </h3>
                <RarityBadge rarity={displayAccessory.rarity} size='sm' />
              </div>
              <p className='text-sm text-chestnut-soft'>
                {displayAccessory.description}
              </p>

              {/* Price */}
              <div className='flex justify-center sm:justify-start'>
                <div className='inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm ring-1 ring-chestnut-light/30'>
                  <span className='text-lg font-black text-transparent bg-gradient-to-r from-autumn-coral to-autumn-cinnamon bg-clip-text'>
                    {accessoryPrice}
                  </span>
                  <span className='text-lg'>🪙</span>
                  <span className='text-xs text-chestnut-soft'>Koins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className='mt-4 bg-gradient-to-r from-pastel-sky/30 to-pastel-mint/30 rounded-xl p-4 ring-1 ring-moss-pastel/30'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl animate-pulse'>💡</span>
          <div>
            <p className='text-sm font-bold text-chestnut-deep'>
              Système en développement
            </p>
            <p className='text-xs text-chestnut-soft'>
              Le système d'achat et d'équipement des accessoires arrive bientôt !
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
