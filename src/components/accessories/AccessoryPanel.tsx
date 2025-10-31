/**
 * AccessoryPanel Component
 *
 * Complete panel for managing a monster's accessories.
 * Shows all three slots (hat, glasses, shoes) with equip/unequip functionality.
 *
 * Architecture:
 * - Client component (interactive panel)
 * - Single Responsibility: Orchestrate accessory management UI
 * - Uses composition of AccessorySlot and AccessorySelector
 * - Dependency Inversion: Depends on hooks interface, not implementation
 *
 * @module components/accessories
 */

'use client'

import { useState, useEffect } from 'react'
import { AccessorySlot } from './AccessorySlot'
import { AccessorySelector } from './AccessorySelector'
import { useAccessories } from '@/hooks/accessories/use-accessories'
import { useEquipAccessory } from '@/hooks/accessories/use-equip-accessory'
import { getCreatureEquipment } from '@/actions/accessories.actions'
import type { AccessoryCategory } from '@/types/accessory.types'

interface AccessoryPanelProps {
  /** Monster ID to manage accessories for */
  monsterId: string
  /** Callback when accessories change (for parent refresh) */
  onAccessoriesChange?: () => void
}

/**
 * AccessoryPanel - Complete accessory management interface
 *
 * This component provides a full-featured UI for:
 * - Viewing equipped accessories
 * - Equipping new accessories from owned collection
 * - Unequipping accessories
 * - Visual feedback during operations
 * - Automatic equipment fetching
 *
 * It integrates with the accessories hooks system and handles
 * all the state management internally.
 *
 * Design Principles:
 * - Open/Closed: Can add new categories without modifying core logic
 * - Single Responsibility: Only manages accessory UI interactions
 * - Dependency Inversion: Depends on abstractions (hooks) not concrete implementations
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <AccessoryPanel
 *   monsterId="monster_123"
 *   onAccessoriesChange={() => refreshMonster()}
 * />
 * ```
 */
export function AccessoryPanel ({
  monsterId,
  onAccessoriesChange
}: AccessoryPanelProps): React.ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | null>(null)
  const [equipment, setEquipment] = useState<{
    hat: any | null
    glasses: any | null
    shoes: any | null
  }>({
    hat: null,
    glasses: null,
    shoes: null
  })
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true)

  const { accessories, loading } = useAccessories()
  const { equipAccessory, unequipAccessory, isEquipping } = useEquipAccessory(monsterId)

  /**
   * Fetch equipment on mount and when monsterId changes
   * Follows Single Responsibility: This component manages its own data
   */
  useEffect(() => {
    const fetchEquipment = async (): Promise<void> => {
      try {
        setIsLoadingEquipment(true)
        const result = await getCreatureEquipment(monsterId)
        setEquipment(result)
      } catch (error) {
        console.error('Failed to fetch equipment:', error)
      } finally {
        setIsLoadingEquipment(false)
      }
    }

    void fetchEquipment()
  }, [monsterId])

  /**
   * Handle accessory selection from the modal
   */
  const handleSelectAccessory = (accessoryDbId: string): void => {
    void (async () => {
      const result = await equipAccessory(accessoryDbId)

      if (result.success) {
        setSelectedCategory(null) // Close modal
        // Refresh equipment
        const newEquipment = await getCreatureEquipment(monsterId)
        setEquipment(newEquipment)
        onAccessoriesChange?.() // Notify parent
      } else if (result.error != null) {
        // Show error to user (you could use a toast notification here)
        console.error('Failed to equip accessory:', result.error)
      }
    })()
  }

  /**
   * Handle unequipping an accessory
   */
  const handleUnequip = (accessoryDbId: string): void => {
    void (async () => {
      const result = await unequipAccessory(accessoryDbId)

      if (result.success) {
        // Refresh equipment
        const newEquipment = await getCreatureEquipment(monsterId)
        setEquipment(newEquipment)
        onAccessoriesChange?.() // Notify parent
      } else if (result.error != null) {
        console.error('Failed to unequip accessory:', result.error)
      }
    })()
  }

  if (isLoadingEquipment) {
    return (
      <div className='rounded-2xl bg-gradient-to-br from-autumn-cream to-autumn-peach/30 p-6 shadow-md border-2 border-autumn-peach/30'>
        <div className='text-center py-8'>
          <div className='inline-flex items-center gap-2 rounded-full bg-autumn-cream px-4 py-2 text-sm text-chestnut-dark shadow-sm'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-autumn-cinnamon border-t-transparent' />
            <span>Chargement des accessoires...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='rounded-2xl bg-gradient-to-br from-autumn-cream to-autumn-peach/30 p-6 shadow-md border-2 border-autumn-peach/30'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-3'>
        <span className='text-3xl'>✨</span>
        <div>
          <h3 className='text-xl font-bold text-chestnut-deep'>
            Accessoires
          </h3>
          <p className='text-sm text-chestnut-dark'>
            Personnalisez votre créature
          </p>
        </div>
      </div>

      {/* Accessory Slots Grid */}
      <div className='grid grid-cols-3 gap-6'>
        <AccessorySlot
          category='hat'
          equipped={equipment.hat}
          onSelectAccessory={setSelectedCategory}
          onUnequip={handleUnequip}
        />
        <AccessorySlot
          category='glasses'
          equipped={equipment.glasses}
          onSelectAccessory={setSelectedCategory}
          onUnequip={handleUnequip}
        />
        <AccessorySlot
          category='shoes'
          equipped={equipment.shoes}
          onSelectAccessory={setSelectedCategory}
          onUnequip={handleUnequip}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className='mt-4 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full bg-autumn-cream px-4 py-2 text-sm text-chestnut-dark shadow-sm'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-autumn-cinnamon border-t-transparent' />
            <span>Chargement des accessoires...</span>
          </div>
        </div>
      )}

      {/* Accessory Selector Modal */}
      {selectedCategory != null && (
        <AccessorySelector
          category={selectedCategory}
          ownedAccessories={accessories}
          onSelect={handleSelectAccessory}
          onClose={() => { setSelectedCategory(null) }}
          isSelecting={isEquipping}
        />
      )}
    </div>
  )
}
