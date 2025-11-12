/**
 * BackgroundCard Component
 *
 * Displays a background card in TamagoTcheat style.
 * Matches the design of AccessoryCard with SVG preview.
 *
 * Design Principles:
 * - Single Responsibility: Display and purchase interaction for one background
 * - Open/Closed: Extensible through props without modification
 * - Dependency Inversion: Depends on abstractions (callbacks)
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import type { Background } from '@/types/background.types'
import { getBackgroundPrice } from '@/config/backgrounds.config'
import RarityBadge from '../accessories/RarityBadge'
import Image from 'next/image'

interface BackgroundCardProps {
  /** The background to display */
  background: Background
  /** Whether the purchase is in progress */
  isPurchasing?: boolean
  /** Callback when the purchase button is clicked */
  onPurchase?: (backgroundId: string) => void
  /** Whether the user can afford this background */
  canAfford?: boolean
  /** Whether the background is already owned */
  isOwned?: boolean
}

export default function BackgroundCard ({
  background,
  isPurchasing = false,
  onPurchase,
  canAfford = true,
  isOwned = false
}: BackgroundCardProps): ReactNode {
  const price = getBackgroundPrice(background)

  const handlePurchase = (): void => {
    if (onPurchase !== undefined && !isPurchasing && canAfford && !isOwned) {
      onPurchase(background.id)
    }
  }

  return (
    <div
      className='group block bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
    >
      {/* Header avec preview du background */}
      <div className='relative bg-white p-6 flex items-center justify-center min-h-[180px] overflow-hidden'>
        {/* Rarity Badge - Top right */}
        <div className='absolute top-3 right-3 z-10'>
          <RarityBadge rarity={background.rarity} size='sm' />
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

        {/* Background Preview - SVG avec dimensions fixes */}
        <div className='relative w-32 h-32 transition-transform duration-500 group-hover:scale-110 rounded-xl overflow-hidden shadow-inner'>
          <Image
            src={background.assetPath}
            alt={background.name}
            fill
            className='object-cover'
            sizes='128px'
            priority={false}
          />
        </div>
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        {/* Name */}
        <h3 className='text-lg font-semibold text-chestnut-deep transition-colors duration-300 group-hover:text-autumn-cinnamon'>
          {background.name}
        </h3>

        {/* Description */}
        <p className='text-sm text-chestnut-medium line-clamp-2 min-h-[40px]'>
          {background.description}
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
