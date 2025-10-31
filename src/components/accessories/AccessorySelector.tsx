/**
 * AccessorySelector Component
 *
 * Modal for selecting and equipping accessories.
 * Shows owned accessories filtered by category.
 *
 * Architecture:
 * - Client component (interactive modal)
 * - Single Responsibility: Accessory selection UI
 * - Integrates with equip hooks
 *
 * @module components/accessories
 */

'use client'

import { useState } from 'react'
import { AccessoryPreview } from './AccessoryPreview'
import { getAccessoryById, getAccessoryPrice } from '@/config/accessories.config'
import type { AccessoryCategory, OwnedAccessory } from '@/types/accessory.types'

interface AccessorySelectorProps {
  /** Category to filter accessories by */
  category: AccessoryCategory
  /** User's owned accessories */
  ownedAccessories: OwnedAccessory[]
  /** Callback when accessory is selected */
  onSelect: (accessoryDbId: string) => void
  /** Callback when modal should close */
  onClose: () => void
  /** Whether selection is in progress */
  isSelecting?: boolean
}

/**
 * AccessorySelector - Modal for choosing accessories
 *
 * Displays all owned accessories of a specific category.
 * Allows user to equip one by clicking on it.
 *
 * Features:
 * - Filtered by category
 * - Shows preview, name, and rarity
 * - Loading state during equip
 * - Empty state if no accessories owned
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <AccessorySelector
 *   category="hat"
 *   ownedAccessories={myAccessories}
 *   onSelect={(id) => equipAccessory(id)}
 *   onClose={() => setShowSelector(false)}
 * />
 * ```
 */
export function AccessorySelector ({
  category,
  ownedAccessories,
  onSelect,
  onClose,
  isSelecting = false
}: AccessorySelectorProps): React.ReactNode {
  // Filter accessories by category
  const categoryAccessories = ownedAccessories.filter(owned => {
    const info = getAccessoryById(owned.accessoryId)
    return info?.category === category
  })

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
      onClick={onClose}
    >
      <div
        className='max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl'
        onClick={(e) => { e.stopPropagation() }}
      >
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-chestnut-deep'>
            Choisir un accessoire
          </h2>
          <button
            onClick={onClose}
            className='rounded-full p-2 text-chestnut-medium transition-colors hover:bg-chestnut-soft hover:text-chestnut-deep'
            disabled={isSelecting}
          >
            <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Accessories Grid */}
        {categoryAccessories.length > 0 ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
            {categoryAccessories.map((owned) => {
              const info = getAccessoryById(owned.accessoryId)
              if (info == null) return null

              const isEquipped = owned.equippedOnMonsterId != null

              return (
                <button
                  key={String(owned._id)}
                  onClick={() => { onSelect(String(owned._id)) }}
                  disabled={isSelecting || isEquipped}
                  className={`
                    group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all
                    ${isEquipped
                      ? 'border-moss-medium bg-moss-soft cursor-not-allowed opacity-60'
                      : 'border-chestnut-soft bg-white hover:border-monster-blue hover:shadow-md'
                    }
                    ${isSelecting ? 'cursor-wait opacity-50' : ''}
                  `}
                >
                  {/* Preview */}
                  <AccessoryPreview
                    accessoryId={info.id}
                    category={info.category}
                    rarity={info.rarity}
                    size={80}
                  />

                  {/* Name */}
                  <p className='text-center text-sm font-medium text-chestnut-deep'>
                    {info.name}
                  </p>

                  {/* Equipped Badge */}
                  {isEquipped && (
                    <span className='absolute right-2 top-2 rounded-full bg-moss-medium px-2 py-1 text-xs font-semibold text-white'>
                      Équipé
                    </span>
                  )}

                  {/* Hover Effect */}
                  {!isEquipped && !isSelecting && (
                    <div className='absolute inset-0 hidden items-center justify-center rounded-xl bg-monster-blue bg-opacity-10 group-hover:flex'>
                      <span className='text-sm font-semibold text-monster-blue'>
                        Équiper
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          // Empty State
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <span className='mb-4 text-6xl opacity-50'>😢</span>
            <p className='text-lg font-semibold text-chestnut-deep'>
              Aucun accessoire de cette catégorie
            </p>
            <p className='mt-2 text-sm text-chestnut-medium'>
              Visitez la boutique pour acheter des accessoires !
            </p>
          </div>
        )}

        {/* Loading Overlay */}
        {isSelecting && (
          <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-white bg-opacity-75'>
            <div className='flex flex-col items-center gap-3'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-monster-blue border-t-transparent' />
              <p className='text-sm font-medium text-chestnut-deep'>
                Équipement en cours...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
