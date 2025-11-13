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
 * - Custom Hooks: Encapsulates complex logic for better reusability
 *
 * @module components/accessories
 */

'use client'

import { useState, type ReactNode } from 'react'
import { AccessorySlot } from './AccessorySlot'
import { AccessorySelector } from './AccessorySelector'
import { useAccessoryManagement } from '@/hooks/use-accessory-management'
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
 * - Custom Hooks: Separates state management from presentation
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
}: AccessoryPanelProps): ReactNode {
  // Modal state
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | null>(null)

  // Accessory state management
  const {
    accessories,
    equipment,
    isLoadingEquipment,
    isLoadingAccessories,
    isOperating,
    handleEquip,
    handleUnequip
  } = useAccessoryManagement({ monsterId, onAccessoriesChange })

  /**
   * Handle accessory selection with modal closure
   */
  const onSelectAccessory = (accessoryDbId: string): void => {
    void (async () => {
      const success = await handleEquip(accessoryDbId)
      if (success) {
        setSelectedCategory(null) // Close modal
      }
    })()
  }

  /**
   * Handle unequip operation
   */
  const onUnequip = (accessoryDbId: string): void => {
    void handleUnequip(accessoryDbId)
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
          onUnequip={onUnequip}
        />
        <AccessorySlot
          category='glasses'
          equipped={equipment.glasses}
          onSelectAccessory={setSelectedCategory}
          onUnequip={onUnequip}
        />
        <AccessorySlot
          category='shoes'
          equipped={equipment.shoes}
          onSelectAccessory={setSelectedCategory}
          onUnequip={onUnequip}
        />
      </div>

      {/* Loading State */}
      {isLoadingAccessories && (
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
          onSelect={onSelectAccessory}
          onClose={() => { setSelectedCategory(null) }}
          isSelecting={isOperating}
        />
      )}
    </div>
  )
}
