/**
 * useAccessories Hook
 *
 * React hook for managing user's accessory collection.
 * Provides access to owned accessories with loading state and refresh capability.
 *
 * Architecture:
 * - Single Responsibility: Manages accessories state
 * - Separation of Concerns: UI logic separated from business logic
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMyAccessories } from '@/actions/accessories.actions'
import type { OwnedAccessory } from '@/types/accessory.types'

interface UseAccessoriesResult {
  /** User's owned accessories */
  accessories: OwnedAccessory[]
  /** Whether accessories are being loaded */
  loading: boolean
  /** Error message if loading failed */
  error: string | null
  /** Manually refresh the accessories list */
  refresh: () => Promise<void>
}

/**
 * Hook to manage user's accessory collection
 *
 * @returns Accessories state and refresh function
 *
 * @example
 * ```tsx
 * function MyAccessories() {
 *   const { accessories, loading, error, refresh } = useAccessories()
 *
 *   if (loading) return <div>Chargement...</div>
 *   if (error) return <div>Erreur: {error}</div>
 *
 *   return (
 *     <div>
 *       {accessories.map(acc => (
 *         <div key={acc._id}>{acc.accessoryId}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useAccessories (): UseAccessoriesResult {
  const [accessories, setAccessories] = useState<OwnedAccessory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAccessories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyAccessories()
      setAccessories(data)
    } catch (err) {
      console.error('Error loading accessories:', err)
      setError('Erreur lors du chargement des accessoires')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load accessories on mount
  useEffect(() => {
    void loadAccessories()
  }, [loadAccessories])

  return {
    accessories,
    loading,
    error,
    refresh: loadAccessories
  }
}
