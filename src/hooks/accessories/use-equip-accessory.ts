/**
 * useEquipAccessory Hook
 *
 * React hook for equipping and unequipping accessories on a monster.
 * Provides loading state and automatic refresh of accessories list.
 *
 * Architecture:
 * - Single Responsibility: Manages equipment operations
 * - Separation of Concerns: UI logic separated from business logic
 */

'use client'

import { useState } from 'react'
import {
  equipAccessory as equipAccessoryAction,
  unequipAccessory as unequipAccessoryAction
} from '@/actions/accessories.actions'
import { useAccessories } from './use-accessories'

interface UseEquipAccessoryResult {
  /** Equip an accessory on the monster */
  equipAccessory: (accessoryDbId: string) => Promise<{ success: boolean, error?: string }>
  /** Unequip an accessory from the monster */
  unequipAccessory: (accessoryDbId: string) => Promise<{ success: boolean, error?: string }>
  /** Whether an equip/unequip operation is in progress */
  isEquipping: boolean
}

/**
 * Hook to manage accessory equipment on a monster
 *
 * @param monsterId - The monster to equip accessories on
 * @returns Equipment functions and loading state
 *
 * @example
 * ```tsx
 * function MonsterAccessories({ monsterId }: { monsterId: string }) {
 *   const { equipAccessory, unequipAccessory, isEquipping } = useEquipAccessory(monsterId)
 *
 *   const handleEquip = async (accessoryId: string) => {
 *     const result = await equipAccessory(accessoryId)
 *     if (result.success) {
 *       console.log('Equipped!')
 *     } else {
 *       console.error(result.error)
 *     }
 *   }
 *
 *   return <button onClick={() => handleEquip('123')} disabled={isEquipping}>
 *     Équiper
 *   </button>
 * }
 * ```
 */
export function useEquipAccessory (monsterId: string): UseEquipAccessoryResult {
  const [isEquipping, setIsEquipping] = useState(false)
  const { refresh } = useAccessories()

  const equipAccessory = async (
    accessoryDbId: string
  ): Promise<{ success: boolean, error?: string }> => {
    setIsEquipping(true)
    try {
      const result = await equipAccessoryAction(accessoryDbId, monsterId)

      if (result.success) {
        // Refresh accessories list to update UI
        await refresh()
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (err) {
      console.error('Error equipping accessory:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erreur lors de l\'équipement'
      }
    } finally {
      setIsEquipping(false)
    }
  }

  const unequipAccessory = async (
    accessoryDbId: string
  ): Promise<{ success: boolean, error?: string }> => {
    setIsEquipping(true)
    try {
      const result = await unequipAccessoryAction(accessoryDbId)

      if (result.success) {
        // Refresh accessories list to update UI
        await refresh()
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (err) {
      console.error('Error unequipping accessory:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erreur lors du retrait'
      }
    } finally {
      setIsEquipping(false)
    }
  }

  return {
    equipAccessory,
    unequipAccessory,
    isEquipping
  }
}
