/**
 * useMonsterPolling Hook
 *
 * Simple polling hook to periodically refresh a monster's data.
 * Works with the lazy state decay system - the backend computes state on each read.
 *
 * Architecture:
 * - Frontend: Polls every 2 seconds
 * - Backend: Applies lazy state computation on each GET
 * - Result: Always up-to-date monster without cron jobs
 *
 * This is much more efficient than the old system because:
 * 1. No global cron updating ALL monsters every minute
 * 2. State is computed only when monster is viewed
 * 3. Simple polling instead of complex state management
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
   * Logger with conditional output
   */
  const log = useCallback((message: string, data?: unknown): void => {
    if (!verbose) return
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [MONSTER-POLL]`, message, data ?? '')
  }, [verbose])

  /**
   * Fetches fresh monster data from the API
   * Backend will apply lazy state computation automatically
   */
  const fetchMonster = useCallback(async (): Promise<void> => {
    // Prevent concurrent fetches
    if (isLoadingRef.current) {
      log('⏭️ Fetch already in progress, skipping')
      return
    }

    isLoadingRef.current = true
    setIsLoading(true)

    try {
      const monsterId = monster.id ?? monster._id
      if (monsterId == null) {
        log('⚠️ No monster ID available')
        return
      }

      log(`🔄 Fetching monster ${monsterId}`)

      const response = await fetch(`/api/monsters/${monsterId}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        log(`❌ Failed to fetch monster: ${response.status}`)
        return
      }

      const freshMonster = await response.json() as Monster

      // Check if state has changed
      const oldState = previousStateRef.current
      const newState = freshMonster.state

      if (oldState !== newState) {
        log(`✨ State changed: ${oldState} → ${newState}`)
        previousStateRef.current = newState

        // Call callback if provided
        if (onStateChange != null) {
          onStateChange(newState, oldState)
        }
      } else {
        log(`✅ State unchanged (${newState})`)
      }

      // Update monster data
      setMonster(freshMonster)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      log('💥 Error fetching monster:', errorMessage)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [monster.id, monster._id, onStateChange, log])

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async (): Promise<void> => {
    await fetchMonster()
  }, [fetchMonster])

  /**
   * Setup polling interval
   */
  useEffect(() => {
    if (!enabled) {
      log('⏸️ Polling disabled')
      return
    }

    log(`🚀 Starting polling (every ${pollingInterval}ms)`)

    // Immediate first fetch
    void fetchMonster()

    // Setup interval for periodic fetches
    intervalRef.current = setInterval(() => {
      void fetchMonster()
    }, pollingInterval)

    // Cleanup on unmount
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
