/**
 * useAccessoryManagement Hook
 *
 * Custom hook for managing monster accessory equipment.
 * Encapsulates all business logic for fetching, equipping, and unequipping accessories.
 *
 * Architecture:
 * - Single Responsibility: Manages accessory state and operations
 * - Dependency Inversion: Depends on actions abstraction
 * - Reusability: Can be used in any component needing accessory management
 *
 * @module hooks
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getCreatureEquipment } from '@/actions/accessories.actions'
import { useAccessories } from '@/hooks/accessories/use-accessories'
import { useEquipAccessory } from '@/hooks/accessories/use-equip-accessory'
import type { OwnedAccessory } from '@/types/accessory.types'

/**
 * Equipment state for all accessory categories
 */
export interface EquipmentState {
  hat: OwnedAccessory | null
  glasses: OwnedAccessory | null
  shoes: OwnedAccessory | null
}

/**
 * Hook options
 */
export interface UseAccessoryManagementOptions {
  /** Monster ID to manage accessories for */
  monsterId: string
  /** Callback when accessories change */
  onAccessoriesChange?: () => void
}

/**
 * Hook return type
 */
export interface UseAccessoryManagementReturn {
  /** All owned accessories */
  accessories: OwnedAccessory[]
  /** Current equipment state */
  equipment: EquipmentState
  /** Is loading initial equipment */
  isLoadingEquipment: boolean
  /** Is loading accessories list */
  isLoadingAccessories: boolean
  /** Is performing equip/unequip operation */
  isOperating: boolean
  /** Equip an accessory */
  handleEquip: (accessoryDbId: string) => Promise<boolean>
  /** Unequip an accessory */
  handleUnequip: (accessoryDbId: string) => Promise<boolean>
  /** Refresh equipment from server */
  refreshEquipment: () => Promise<void>
}

/**
 * useAccessoryManagement - Complete accessory state management
 *
 * This hook provides a complete solution for accessory management:
 * - Fetches and manages equipment state
 * - Fetches and manages owned accessories
 * - Handles equip/unequip operations
 * - Manages loading and operating states
 * - Triggers callbacks on changes
 * - Memoizes callbacks to prevent unnecessary re-renders
 *
 * Design Principles:
 * - Single Responsibility: Only manages accessory state
 * - Dependency Inversion: Depends on actions abstraction
 * - Open/Closed: Can extend without modifying
 *
 * @param options - Hook configuration
 * @returns Accessory management state and operations
 *
 * @example
 * ```tsx
 * const {
 *   accessories,
 *   equipment,
 *   isLoadingEquipment,
 *   isOperating,
 *   handleEquip,
 *   handleUnequip
 * } = useAccessoryManagement({
 *   monsterId: 'monster_123',
 *   onAccessoriesChange: () => console.log('Changed!')
 * })
 * ```
 */
export function useAccessoryManagement ({
  monsterId,
  onAccessoriesChange
}: UseAccessoryManagementOptions): UseAccessoryManagementReturn {
  const [equipment, setEquipment] = useState<EquipmentState>({
    hat: null,
    glasses: null,
    shoes: null
  })
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true)

  // Use existing hooks for accessories and equip operations
  const { accessories, loading: isLoadingAccessories } = useAccessories()
  const { equipAccessory, unequipAccessory, isEquipping } = useEquipAccessory(monsterId)

  /**
   * Fetch equipment data
   */
  const fetchEquipment = useCallback(async (): Promise<void> => {
    try {
      setIsLoadingEquipment(true)
      const result = await getCreatureEquipment(monsterId)
      setEquipment(result)
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
    } finally {
      setIsLoadingEquipment(false)
    }
  }, [monsterId])

  /**
   * Handle equipping an accessory
   */
  const handleEquip = useCallback(async (accessoryDbId: string): Promise<boolean> => {
    try {
      const result = await equipAccessory(accessoryDbId)

      if (result.success) {
        // Refresh equipment
        const newEquipment = await getCreatureEquipment(monsterId)
        setEquipment(newEquipment)
        onAccessoriesChange?.()
        return true
      } else {
        console.error('Failed to equip accessory:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error equipping accessory:', error)
      return false
    }
  }, [equipAccessory, monsterId, onAccessoriesChange])

  /**
   * Handle unequipping an accessory
   */
  const handleUnequip = useCallback(async (accessoryDbId: string): Promise<boolean> => {
    try {
      const result = await unequipAccessory(accessoryDbId)

      if (result.success) {
        // Refresh equipment
        const newEquipment = await getCreatureEquipment(monsterId)
        setEquipment(newEquipment)
        onAccessoriesChange?.()
        return true
      } else {
        console.error('Failed to unequip accessory:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error unequipping accessory:', error)
      return false
    }
  }, [unequipAccessory, monsterId, onAccessoriesChange])

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    void fetchEquipment()
  }, [fetchEquipment])

  /**
   * Memoize return object to prevent unnecessary re-renders
   */
  return useMemo(() => ({
    accessories,
    equipment,
    isLoadingEquipment,
    isLoadingAccessories,
    isOperating: isEquipping,
    handleEquip,
    handleUnequip,
    refreshEquipment: fetchEquipment
  }), [
    accessories,
    equipment,
    isLoadingEquipment,
    isLoadingAccessories,
    isEquipping,
    handleEquip,
    handleUnequip,
    fetchEquipment
  ])
}
