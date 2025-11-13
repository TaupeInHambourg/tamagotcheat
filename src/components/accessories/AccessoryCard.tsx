/**
 * AccessoryCard Component
 *
 * Displays an accessory card using the generic ShopCard component.
 * Provides accessory-specific preview rendering.
 *
 * Design Principles:
 * - DRY: Reuses ShopCard for layout and behavior
 * - Single Responsibility: Only handles accessory-specific rendering
 * - Open/Closed: Extended from ShopCard without modifying it
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import type { Accessory } from '@/types/accessory.types'
import { getAccessoryPrice } from '@/config/accessories.config'
import { AccessoryPreview } from './AccessoryPreview'
import { ShopCard } from '@/components/common'

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

  return (
    <ShopCard
      id={accessory.id}
      name={accessory.name}
      description={accessory.description}
      rarity={accessory.rarity}
      price={price}
      isPurchasing={isPurchasing}
      onPurchase={onPurchase}
      canAfford={canAfford}
      isOwned={isOwned}
      renderPreview={() => (
        <AccessoryPreview
          accessoryId={accessory.id}
          category={accessory.category}
          rarity={accessory.rarity}
          size={120}
        />
      )}
    />
  )
}
