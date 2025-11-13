/**
 * ShopCard Component
 *
 * Generic reusable card for shop items (accessories, backgrounds, etc.).
 * Eliminates code duplication between AccessoryCard and BackgroundCard.
 *
 * Design Principles:
 * - Single Responsibility: Display and purchase interaction for one shop item
 * - Open/Closed: Extensible through props without modification
 * - Dependency Inversion: Depends on abstractions (callbacks and render props)
 * - DRY: Single source of truth for shop card layout and behavior
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import type { Rarity } from '@/types/accessory.types'
import RarityBadge from '../accessories/RarityBadge'

export interface ShopCardProps {
  /** Unique identifier for the item */
  id: string
  /** Item name */
  name: string
  /** Item description */
  description: string
  /** Rarity level */
  rarity: Rarity
  /** Price in Koins */
  price: number
  /** Whether the purchase is in progress */
  isPurchasing?: boolean
  /** Callback when the purchase button is clicked */
  onPurchase?: (itemId: string) => void
  /** Whether the user can afford this item */
  canAfford?: boolean
  /** Whether the item is already owned */
  isOwned?: boolean
  /** Custom render function for the preview area */
  renderPreview: () => ReactNode
}

/**
 * Generic shop card with consistent layout and behavior
 */
export default function ShopCard ({
  id,
  name,
  description,
  rarity,
  price,
  isPurchasing = false,
  onPurchase,
  canAfford = true,
  isOwned = false,
  renderPreview
}: ShopCardProps): ReactNode {
  const handlePurchase = (): void => {
    if (onPurchase !== undefined && !isPurchasing && canAfford && !isOwned) {
      onPurchase(id)
    }
  }

  return (
    <div className='group block bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
      {/* Header with preview */}
      <div className='relative bg-white p-6 flex items-center justify-center min-h-[180px]'>
        {/* Rarity Badge - Top right */}
        <div className='absolute top-3 right-3 z-10'>
          <RarityBadge rarity={rarity} size='sm' />
        </div>

        {/* Owned Badge - Top left */}
        {isOwned && (
          <div className='absolute top-3 left-3 z-10'>
            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full bg-moss-medium text-white text-xs font-semibold shadow-sm'>
              <span>✓</span>
              <span>Possédé</span>
            </span>
          </div>
        )}

        {/* Preview Area - Custom render */}
        <div className='transition-transform duration-500 group-hover:scale-110'>
          {renderPreview()}
        </div>
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        {/* Name */}
        <h3 className='text-lg font-semibold text-chestnut-deep transition-colors duration-300 group-hover:text-autumn-cinnamon'>
          {name}
        </h3>

        {/* Description */}
        <p className='text-sm text-chestnut-medium line-clamp-2 min-h-[40px]'>
          {description}
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
