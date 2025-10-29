/**
 * useMonsterAutoRefresh Hook
 *
 * Automatically refreshes monster data when its state changes.
 * Uses polling to detect state changes based on nextStateChangeAt.
 *
 * Features:
 * - Intelligent polling (checks only when state should change)
 * - Automatic cleanup on unmount
 * - Configurable check interval
 * - Detects state changes and triggers refresh
 *
 * Usage:
 * ```tsx
 * const { monster: currentMonster, isRefreshing } = useMonsterAutoRefresh({
 *   initialMonster: monster,
 *   onStateChange: (newState) => console.log('State changed to:', newState)
 * })
 * ```
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Monster } from '@/types/monster.types'

/**
 * Hook configuration options
 */
interface UseMonsterAutoRefreshOptions {
  /** Initial monster data */
  initialMonster: Monster
  /** Callback invoked when state changes */
  onStateChange?: (newState: string, oldState: string) => void
  /** Check interval in milliseconds (default: 5000 = 5 seconds) */
  checkInterval?: number
  /** Enable/disable auto-refresh (default: true) */
  enabled?: boolean
  /** Enable verbose logging (default: false) */
  verbose?: boolean
}

/**
 * Hook return value
 */
interface UseMonsterAutoRefreshReturn {
  /** Current monster data (updated when state changes) */
  monster: Monster
  /** Whether a refresh is currently in progress */
  isRefreshing: boolean
  /** Manually trigger a refresh */
  refresh: () => Promise<void>
  /** Milliseconds until next expected state change */
  timeUntilNextChange: number | null
}

/**
 * Calculates time until next state change
 */
function calculateTimeUntilChange (monster: Monster): number | null {
  if (monster.nextStateChangeAt == null) {
    return null
  }

  const now = Date.now()
  const nextChange = new Date(monster.nextStateChangeAt).getTime()
  const remaining = nextChange - now

  return Math.max(0, remaining)
}

/**
 * Auto-refresh monster hook
 */
export function useMonsterAutoRefresh (
  options: UseMonsterAutoRefreshOptions
): UseMonsterAutoRefreshReturn {
  const {
    initialMonster,
    onStateChange,
    checkInterval = 5000, // 5 seconds
    enabled = true,
    verbose = false
  } = options

  // State
  const [monster, setMonster] = useState<Monster>(initialMonster)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeUntilNextChange, setTimeUntilNextChange] = useState<number | null>(
    calculateTimeUntilChange(initialMonster)
  )

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef(false)
  const previousStateRef = useRef<string>(initialMonster.state)

  /**
   * Logger with conditional output
   */
  const log = useCallback((message: string, data?: unknown): void => {
    if (!verbose) return
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [MONSTER-REFRESH]`, message, data ?? '')
  }, [verbose])

  /**
   * Fetches fresh monster data from the API
   */
  const fetchMonsterData = useCallback(async (): Promise<Monster | null> => {
    try {
      const monsterId = monster.id ?? monster._id
      if (monsterId == null) {
        log('⚠️ No monster ID available')
        return null
      }

      const response = await fetch(`/api/monsters/${monsterId}`)

      if (!response.ok) {
        log(`❌ Failed to fetch monster: ${response.status}`)
        return null
      }

      const data = await response.json() as Monster
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      log('💥 Error fetching monster:', errorMessage)
      return null
    }
  }, [monster.id, monster._id, log])

  /**
   * Checks for state changes and updates if necessary
   */
  const checkAndRefresh = useCallback(async (): Promise<void> => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) {
      log('⏭️ Refresh already in progress, skipping')
      return
    }

    isRefreshingRef.current = true
    setIsRefreshing(true)

    try {
      log('🔄 Checking for state changes...')

      const freshMonster = await fetchMonsterData()

      if (freshMonster == null) {
        log('❌ Failed to fetch fresh data')
        return
      }

      // Check if state has changed
      const oldState = previousStateRef.current
      const newState = freshMonster.state

      if (oldState !== newState) {
        log(`✨ State changed: ${oldState} → ${newState}`)

        // Update state
        setMonster(freshMonster)
        previousStateRef.current = newState

        // Calculate new time until next change
        const newTimeUntilChange = calculateTimeUntilChange(freshMonster)
        setTimeUntilNextChange(newTimeUntilChange)

        // Call callback if provided
        if (onStateChange != null) {
          onStateChange(newState, oldState)
        }
      } else {
        log(`✅ No state change (still ${newState})`)

        // Update time until next change
        const newTimeUntilChange = calculateTimeUntilChange(freshMonster)
        setTimeUntilNextChange(newTimeUntilChange)

        // Update monster data even if state hasn't changed (for other fields)
        setMonster(freshMonster)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      log('💥 Error during refresh:', errorMessage)
    } finally {
      isRefreshingRef.current = false
      setIsRefreshing(false)
    }
  }, [fetchMonsterData, onStateChange, log])

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async (): Promise<void> => {
    await checkAndRefresh()
  }, [checkAndRefresh])

  /**
   * Setup automatic checking
   */
  useEffect(() => {
    if (!enabled) {
      log('⏸️ Auto-refresh disabled')
      return
    }

    log(`🚀 Starting auto-refresh (check every ${checkInterval}ms)`)

    // Immediate check
    void checkAndRefresh()

    // Setup interval for periodic checks
    intervalRef.current = setInterval(() => {
      void checkAndRefresh()
    }, checkInterval)

    // Cleanup on unmount
    return () => {
      log('⏹️ Stopping auto-refresh')
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, checkInterval, checkAndRefresh, log])

  /**
   * Update time countdown every second
   */
  useEffect(() => {
    if (timeUntilNextChange == null) return

    const countdownInterval = setInterval(() => {
      const newTime = calculateTimeUntilChange(monster)
      setTimeUntilNextChange(newTime)
    }, 1000)

    return () => {
      clearInterval(countdownInterval)
    }
  }, [monster, timeUntilNextChange])

  return {
    monster,
    isRefreshing,
    refresh,
    timeUntilNextChange
  }
}
