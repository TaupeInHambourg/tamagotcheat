/**
 * AccessorySlot Component
 *
 * Displays a single accessory slot (hat, glasses, or shoes).
 * Shows equipped accessory or empty slot with equip button.
 *
 * Architecture:
 * - Client component (interactive)
 * - Single Responsibility: Display one accessory slot
 * - Emits events for parent to handle
 *
 * @module components/accessories
 */

'use client'

import { AccessoryPreview } from './AccessoryPreview'
import { getAccessoryById, getCategoryConfig } from '@/config/accessories.config'
import type { AccessoryCategory, OwnedAccessory } from '@/types/accessory.types'

interface AccessorySlotProps {
  /** Category of this slot */
  category: AccessoryCategory
  /** Currently equipped accessory (if any) */
  equipped: OwnedAccessory | null
  /** Callback when user wants to change accessory */
  onSelectAccessory: (category: AccessoryCategory) => void
  /** Callback when user wants to unequip */
  onUnequip?: (accessoryDbId: string) => void
}

/**
 * AccessorySlot - Interactive accessory equipment slot
 *
 * Displays the current accessory or an empty placeholder.
 * Allows users to equip/unequip accessories.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <AccessorySlot
 *   category="hat"
 *   equipped={currentHat}
 *   onSelectAccessory={(cat) => openSelector(cat)}
 *   onUnequip={(id) => unequipAccessory(id)}
 * />
 * ```
 */
export function AccessorySlot ({
  category,
  equipped,
  onSelectAccessory,
  onUnequip
}: AccessorySlotProps): React.ReactNode {
  const categoryConfig = getCategoryConfig(category)
  const accessoryInfo = equipped != null ? getAccessoryById(equipped.accessoryId) : null

  return (
    <div className='flex flex-col items-center gap-3'>
      {/* Category Label */}
      <div className='flex items-center gap-2'>
        <span className='text-2xl'>{categoryConfig.emoji}</span>
        <span className='text-sm font-semibold text-chestnut-deep'>
          {categoryConfig.name}
        </span>
      </div>

      {/* Accessory Display */}
      <div className='relative'>
        {equipped != null && accessoryInfo != null ? (
          // Equipped accessory
          <div className='group relative'>
            <AccessoryPreview
              accessoryId={accessoryInfo.id}
              category={accessoryInfo.category}
              rarity={accessoryInfo.rarity}
              size={96}
            />
            {/* Unequip button */}
            {onUnequip != null && (
              <button
                onClick={() => { onUnequip(String(equipped._id)) }}
                className='absolute -right-2 -top-2 hidden rounded-full bg-maple-warm p-1 text-white shadow-md transition-transform hover:scale-110 group-hover:block'
                title='Retirer'
              >
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        ) : (
          // Empty slot
          <button
            onClick={() => { onSelectAccessory(category) }}
            className='flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-chestnut-medium bg-chestnut-soft transition-colors hover:border-monster-blue hover:bg-pastel-sky'
            title={`Équiper ${categoryConfig.name.toLowerCase()}`}
          >
            <span className='text-3xl opacity-50'>{categoryConfig.emoji}</span>
          </button>
        )}
      </div>

      {/* Accessory Name */}
      <div className='min-h-[2rem] text-center'>
        {accessoryInfo != null
          ? (
            <p className='text-sm font-medium text-chestnut-deep'>{accessoryInfo.name}</p>
            )
          : (
            <button
              onClick={() => { onSelectAccessory(category) }}
              className='text-xs font-medium text-monster-blue transition-colors hover:text-monster-purple'
            >
              Équiper
            </button>
            )}
      </div>
    </div>
  )
}
