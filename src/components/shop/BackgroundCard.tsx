/**
 * BackgroundCard Component
 *
 * Displays a background card using the generic ShopCard component.
 * Provides background-specific preview rendering with Next.js Image.
 *
 * Design Principles:
 * - DRY: Reuses ShopCard for layout and behavior
 * - Single Responsibility: Only handles background-specific rendering
 * - Open/Closed: Extended from ShopCard without modifying it
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import type { Background } from '@/types/background.types'
import { getBackgroundPrice } from '@/config/backgrounds.config'
import Image from 'next/image'
import { ShopCard } from '@/components/common'

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

  return (
    <ShopCard
      id={background.id}
      name={background.name}
      description={background.description}
      rarity={background.rarity}
      price={price}
      isPurchasing={isPurchasing}
      onPurchase={onPurchase}
      canAfford={canAfford}
      isOwned={isOwned}
      renderPreview={() => (
        <div className='relative w-32 h-32 rounded-xl overflow-hidden shadow-inner'>
          <Image
            src={background.assetPath}
            alt={background.name}
            fill
            className='object-cover'
            sizes='128px'
            priority={false}
          />
        </div>
      )}
    />
  )
}
