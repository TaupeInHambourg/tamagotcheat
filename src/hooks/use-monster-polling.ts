/**
 * useMonsterPolling Hook
 *
 * Simple polling hook to periodically refresh a monster's data.
 * Works with the lazy state decay system - the backend computes state on each read.
 *
 * Architecture:
 * - Frontend: Polls every 2 seconds
 * - Backend: Applies lazy state computation (computeCurrentState)
 * - Result: Always up-to-date monster
 *
 * Benefits:
 * - Scalable: Updates only viewed monsters
 * - Simple polling instead of complex state management
 * - Backend handles all state logic (single responsibility)
 *
 * @module use-monster-polling
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Monster } from '@/types/monster.types'

/**
 * Hook configuration options
 */
export interface UseMonsterPollingOptions {
  /** Initial monster data */
  initialMonster: Monster
  /** Callback invoked when state changes */
  onStateChange?: (newState: string, oldState: string) => void
  /** Polling interval in milliseconds (default: 2000 = 2 seconds) */
  pollingInterval?: number
  /** Enable/disable polling (default: true) */
  enabled?: boolean
  /** Enable verbose logging (default: false) */
  verbose?: boolean
}

/**
 * Hook return value
 */
export interface UseMonsterPollingReturn {
  /** Current monster data (updated on each poll) */
  monster: Monster
  /** Whether a fetch is currently in progress */
  isLoading: boolean
  /** Manually trigger a refresh */
  refresh: () => Promise<void>
}

/**
 * Simple monster polling hook
 *
 * @example
 * ```tsx
 * const { monster, isLoading } = useMonsterPolling({
 *   initialMonster: serverMonster,
 *   onStateChange: (newState, oldState) => {
 *     console.log(`State changed: ${oldState} → ${newState}`)
 *   },
 *   pollingInterval: 2000
 * })
 * ```
 */
export function useMonsterPolling (
  options: UseMonsterPollingOptions
): UseMonsterPollingReturn {
  const {
    initialMonster,
    onStateChange,
    pollingInterval = 2000, // 2 seconds default
    enabled = true,
    verbose = false
  } = options

  // State
  const [monster, setMonster] = useState<Monster>(initialMonster)
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isLoadingRef = useRef(false)
  const previousStateRef = useRef<string>(initialMonster.state)

  /**
   * Conditional logger for debugging
   * Only logs when verbose mode is enabled
   *
   * @param message - Log message to display
   * @param data - Optional data to include in log
   */
  const log = useCallback((message: string, data?: unknown): void => {
    if (!verbose) return
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [MONSTER-POLL]`, message, data ?? '')
  }, [verbose])

  /**
   * Fetches fresh monster data from the API
   *
   * How it works:
   * 1. Makes GET request to /api/monsters/[id]
   * 2. Backend applies lazy state computation (computeCurrentState)
   * 3. If state changed in backend, database is updated
   * 4. Returns always up-to-date monster data
   *
   * Concurrency protection:
   * - Uses isLoadingRef to prevent overlapping requests
   * - Essential for high-frequency polling
   *
   * State change detection:
   * - Compares new state with previousStateRef
   * - Calls onStateChange callback if different
   * - Allows UI to react to state changes
   */
  const fetchMonster = useCallback(async (): Promise<void> => {
    // Prevent concurrent fetches (critical for polling)
    if (isLoadingRef.current) {
      log('⏭️ Fetch already in progress, skipping')
      return
    }

    isLoadingRef.current = true
    setIsLoading(true)

    try {
      // Get monster ID (supports both id and _id fields)
      const monsterId = monster.id ?? monster._id
      if (monsterId == null) {
        log('⚠️ No monster ID available')
        return
      }

      log(`🔄 Fetching monster ${monsterId}`)

      // Fetch from API with no-store to bypass Next.js cache
      const response = await fetch(`/api/monsters/${monsterId}`, {
        cache: 'no-store', // Important: always get fresh data
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        log(`❌ Failed to fetch monster: ${response.status}`)
        return
      }

      const freshMonster = await response.json() as Monster

      // Detect state changes for callback notification
      const oldState = previousStateRef.current
      const newState = freshMonster.state

      if (oldState !== newState) {
        log(`✨ State changed: ${oldState} → ${newState}`)
        previousStateRef.current = newState

        // Notify parent component of state change
        if (onStateChange != null) {
          onStateChange(newState, oldState)
        }
      } else {
        log(`✅ State unchanged (${newState})`)
      }

      // Update local state with fresh data
      setMonster(freshMonster)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      log('💥 Error fetching monster:', errorMessage)
    } finally {
      // Always cleanup loading state
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [monster.id, monster._id, onStateChange, log])

  /**
   * Manual refresh function
   * Allows parent components to trigger a refresh on demand
   *
   * @example
   * ```tsx
   * const { refresh } = useMonsterPolling({ initialMonster })
   * <button onClick={refresh}>Refresh Now</button>
   * ```
   */
  const refresh = useCallback(async (): Promise<void> => {
    await fetchMonster()
  }, [fetchMonster])

  /**
   * Setup polling interval
   *
   * Lifecycle:
   * 1. Immediate fetch on mount (if enabled)
   * 2. Setup interval for periodic fetches
   * 3. Cleanup interval on unmount or when disabled
   *
   * Dependencies:
   * - enabled: Controls whether polling is active
   * - pollingInterval: How often to poll
   * - fetchMonster: The actual fetch function
   */
  useEffect(() => {
    if (!enabled) {
      log('⏸️ Polling disabled')
      return
    }

    log(`🚀 Starting polling (every ${pollingInterval}ms)`)

    // Immediate first fetch for instant data
    void fetchMonster()

    // Setup interval for periodic fetches
    intervalRef.current = setInterval(() => {
      void fetchMonster()
    }, pollingInterval)

    // Cleanup on unmount or when dependencies change
    return () => {
      log('⏹️ Stopping polling')
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, pollingInterval, fetchMonster, log])

  return {
    monster,
    isLoading,
    refresh
  }
}
