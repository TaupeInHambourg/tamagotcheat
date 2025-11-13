/**
 * useBackgroundManagement Hook
 *
 * Custom hook for managing background equipment state and operations.
 * Encapsulates all background-related logic for a monster.
 *
 * Architecture:
 * - Single Responsibility: Background state management only
 * - Performance: Memoized callbacks and values
 * - Error handling: Centralized error management
 *
 * @module hooks/use-background-management
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getMyBackgrounds,
  getCreatureBackground,
  equipBackground,
  unequipBackground
} from '@/actions/backgrounds.actions'
import type { BackgroundDB } from '@/types/background.types'

interface UseBackgroundManagementOptions {
  monsterId: string
  onBackgroundChange?: () => void
}

interface UseBackgroundManagementReturn {
  ownedBackgrounds: BackgroundDB[]
  availableBackgrounds: BackgroundDB[]
  equippedBackground: BackgroundDB | null
  isLoading: boolean
  isOperating: boolean
  handleEquip: (backgroundDbId: string) => Promise<boolean>
  handleUnequip: () => Promise<boolean>
  refreshBackgrounds: () => Promise<void>
}

/**
 * Hook to manage background equipment for a monster
 *
 * @param options - Configuration options
 * @returns Background management state and operations
 *
 * @example
 * ```tsx
 * const {
 *   availableBackgrounds,
 *   equippedBackground,
 *   isLoading,
 *   handleEquip,
 *   handleUnequip
 * } = useBackgroundManagement({ monsterId: 'monster_123' })
 * ```
 */
export function useBackgroundManagement ({
  monsterId,
  onBackgroundChange
}: UseBackgroundManagementOptions): UseBackgroundManagementReturn {
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<BackgroundDB[]>([])
  const [equippedBackground, setEquippedBackground] = useState<BackgroundDB | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOperating, setIsOperating] = useState(false)

  /**
   * Memoize available backgrounds (not equipped)
   */
  const availableBackgrounds = useMemo(
    () => ownedBackgrounds.filter(bg => bg.equippedTo == null),
    [ownedBackgrounds]
  )

  /**
   * Fetch backgrounds data
   */
  const fetchBackgrounds = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      const [owned, equipped] = await Promise.all([
        getMyBackgrounds(),
        getCreatureBackground(monsterId)
      ])
      setOwnedBackgrounds(owned)
      setEquippedBackground(equipped)
    } catch (error) {
      console.error('Failed to fetch backgrounds:', error)
    } finally {
      setIsLoading(false)
    }
  }, [monsterId])

  /**
   * Handle equipping a background
   */
  const handleEquip = useCallback(async (backgroundDbId: string): Promise<boolean> => {
    try {
      setIsOperating(true)
      const result = await equipBackground(backgroundDbId, monsterId)

      if (result.success) {
        const newEquipped = await getCreatureBackground(monsterId)
        setEquippedBackground(newEquipped)
        onBackgroundChange?.()
        return true
      } else {
        console.error('Failed to equip background:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error equipping background:', error)
      return false
    } finally {
      setIsOperating(false)
    }
  }, [monsterId, onBackgroundChange])

  /**
   * Handle unequipping the current background
   */
  const handleUnequip = useCallback(async (): Promise<boolean> => {
    if (equippedBackground == null) return false

    try {
      setIsOperating(true)
      const result = await unequipBackground(equippedBackground._id)

      if (result.success) {
        setEquippedBackground(null)
        onBackgroundChange?.()
        return true
      } else {
        console.error('Failed to unequip background:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error unequipping background:', error)
      return false
    } finally {
      setIsOperating(false)
    }
  }, [equippedBackground, onBackgroundChange])

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    void fetchBackgrounds()
  }, [fetchBackgrounds])

  return {
    ownedBackgrounds,
    availableBackgrounds,
    equippedBackground,
    isLoading,
    isOperating,
    handleEquip,
    handleUnequip,
    refreshBackgrounds: fetchBackgrounds
  }
}
