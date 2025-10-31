/**
 * AccessoryCard Component
 *
 * Displays an accessory card in TamagoTcheat style.
 * Matches the design of MonsterCard with subtle animations and cozy colors.
 * Shows pixel art preview instead of emoji.
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import type { Accessory } from '@/types/accessory.types'
import { getAccessoryPrice } from '@/config/accessories.config'
import RarityBadge from './RarityBadge'
import { AccessoryPreview } from './AccessoryPreview'

interface AccessoryCardProps {
  /** The accessory to display */
  accessory: Accessory
  /** Whether the purchase is in progress */
  isPurchasing?: boolean
  /** Callback when the purchase button is clicked */
  onPurchase?: (accessoryId: string) => void
  /** Whether the user can afford this accessory */
  canAfford?: boolean
  /** Whether the accessory is already owned */
  isOwned?: boolean
}

export default function AccessoryCard ({
  accessory,
  isPurchasing = false,
  onPurchase,
  canAfford = true,
  isOwned = false
}: AccessoryCardProps): ReactNode {
  const price = getAccessoryPrice(accessory)

  const handlePurchase = (): void => {
    if (onPurchase !== undefined && !isPurchasing && canAfford && !isOwned) {
      onPurchase(accessory.id)
    }
  }

  return (
    <div
      className='group block bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
    >
      {/* Header avec rareté */}
      <div className='relative bg-gradient-to-br bg-white p-6 flex items-center justify-center min-h-[180px]'>
        {/* Rarity Badge - Top right */}
        <div className='absolute top-3 right-3'>
          <RarityBadge rarity={accessory.rarity} size='sm' />
        </div>

        {/* Owned Badge - Top left */}
        {isOwned && (
          <div className='absolute top-3 left-3'>
            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full bg-moss-medium text-white text-xs font-semibold shadow-sm'>
              <span>✓</span>
              <span>Possédé</span>
            </span>
          </div>
        )}

        {/* Pixel Art Preview - Large et centré */}
        <div className='transition-transform duration-500 group-hover:scale-110'>
          <AccessoryPreview
            accessoryId={accessory.id}
            category={accessory.category}
            rarity={accessory.rarity}
            size={120}
          />
        </div>
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        {/* Name */}
        <h3 className='text-lg font-semibold text-chestnut-deep transition-colors duration-300 group-hover:text-autumn-cinnamon'>
          {accessory.name}
        </h3>

        {/* Description */}
        <p className='text-sm text-chestnut-medium line-clamp-2 min-h-[40px]'>
          {accessory.description}
        </p>

        {/* Price */}
        <div className='flex items-center gap-2'>
          <span className='text-2xl font-bold text-transparent bg-gradient-to-r from-autumn-coral to-autumn-cinnamon bg-clip-text'>
            {price}
          </span>
          <span className='text-xl'>🪙</span>
          <span className='text-xs text-chestnut-soft'>Koins</span>
        </div>

        {/* Purchase Button - Only if onPurchase is provided */}
        {onPurchase !== undefined && (
          <button
            onClick={handlePurchase}
            disabled={!canAfford || isPurchasing || isOwned}
            className={`
              w-full py-2.5 rounded-xl font-semibold text-sm
              transition-all duration-300
              flex items-center justify-center gap-2
              ${canAfford && !isPurchasing && !isOwned
                ? 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-chestnut-light/50 text-chestnut-soft cursor-not-allowed'
              }
            `}
          >
            {isPurchasing
              ? (
                <>
                  <span className='animate-spin'>⏳</span>
                  <span>Achat...</span>
                </>
                )
              : isOwned
                ? (
                  <>
                    <span>✓</span>
                    <span>Déjà possédé</span>
                  </>
                  )
                : canAfford
                  ? (
                    <>
                      <span>🛒</span>
                      <span>Acheter</span>
                    </>
                    )
                  : (
                    <>
                      <span>❌</span>
                      <span>Pas assez de Koins</span>
                    </>
                    )}
          </button>
        )}
      </div>
    </div>
  )
}
