/**
 * useAutoUpdateMonsters Hook
 *
 * React hook for triggering automated monster state updates from the client.
 * Schedules periodic calls to the cron endpoint with randomized intervals.
 *
 * Features:
 * - Randomized intervals between updates (prevents predictable patterns)
 * - Concurrency guards (prevents overlapping updates)
 * - Automatic retry on failure
 * - Optional verbose logging
 * - Manual trigger capability
 *
 * Usage:
 * ```tsx
 * const { trigger, isUpdating, lastUpdate } = useAutoUpdateMonsters({
 *   userId: session?.user?.id,
 *   minInterval: 60000,  // 1 minute
 *   maxInterval: 180000, // 3 minutes
 *   enabled: true,
 *   verbose: true
 * })
 * ```
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Hook configuration options
 */
interface UseAutoUpdateMonstersOptions {
  /** User ID for filtering updates (optional) */
  userId?: string | null
  /** Minimum interval between updates in ms (default: 60000 = 1 min) */
  minInterval?: number
  /** Maximum interval between updates in ms (default: 180000 = 3 min) */
  maxInterval?: number
  /** Enable/disable automatic updates (default: true) */
  enabled?: boolean
  /** Callback invoked after each update */
  onUpdate?: (result: UpdateResult) => void
  /** Enable verbose console logging (default: false) */
  verbose?: boolean
}

/**
 * Result of an update operation
 */
interface UpdateResult {
  success: boolean
  updated?: number
  timestamp?: string
  duration?: number
  error?: string
}

/**
 * Hook return value
 */
interface UseAutoUpdateMonstersReturn {
  /** Manually trigger an update */
  trigger: () => Promise<void>
  /** Whether an update is currently in progress */
  isUpdating: boolean
  /** Result of the last update */
  lastUpdate: UpdateResult | null
  /** Total number of updates performed */
  updateCount: number
  /** Milliseconds until next scheduled update */
  nextUpdateIn: number | null
}

/**
 * Auto-update monsters hook
 */
export function useAutoUpdateMonsters (
  options: UseAutoUpdateMonstersOptions = {}
): UseAutoUpdateMonstersReturn {
  const {
    userId = null,
    minInterval = 60000, // 1 minute
    maxInterval = 180000, // 3 minutes
    enabled = true,
    onUpdate,
    verbose = false
  } = options

  // Refs for managing timers and state
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUpdatingRef = useRef(false)

  // State
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<UpdateResult | null>(null)
  const [updateCount, setUpdateCount] = useState(0)
  const [nextUpdateIn, setNextUpdateIn] = useState<number | null>(null)

  /**
   * Logger with conditional output based on verbose flag
   */
  const log = useCallback((level: 'log' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void => {
    if (!verbose) return

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [AUTO-UPDATE]`

    if (data != null) {
      console[level](`${prefix} ${message}`, data)
    } else {
      console[level](`${prefix} ${message}`)
    }
  }, [verbose])

  /**
   * Generates a random interval between min and max
   */
  const getRandomInterval = useCallback((): number => {
    return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  }, [minInterval, maxInterval])

  /**
   * Performs the actual update by calling the cron endpoint
   */
  const updateMonsters = useCallback(async (): Promise<void> => {
    // Guard against concurrent updates
    if (isUpdatingRef.current) {
      log('warn', '⚠️ Update already in progress, skipping')
      return
    }

    isUpdatingRef.current = true
    setIsUpdating(true)

    try {
      const startTime = Date.now()

      log('log', `🔄 Triggering monster update${userId != null ? ` for user ${userId}` : ''}`)

      // Build URL with optional userId parameter
      const url = userId != null
        ? `/api/cron/update-monsters?userId=${encodeURIComponent(userId)}`
        : '/api/cron/update-monsters'

      // Call cron endpoint
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET_TOKEN ?? ''}`,
          'Content-Type': 'application/json'
        }
      })

      const data: unknown = await response.json()
      const parsedData = data as Record<string, unknown>

      if (response.ok) {
        const result: UpdateResult = {
          success: true,
          updated: parsedData.updated as number,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }

        log('log', '✅ Update successful', {
          updated: result.updated,
          duration: `${result.duration ?? 0}ms`
        })

        setLastUpdate(result)
        setUpdateCount(prev => prev + 1)

        // Call callback if provided
        if (onUpdate != null) {
          onUpdate(result)
        }
      } else {
        const result: UpdateResult = {
          success: false,
          error: parsedData.error as string ?? 'Unknown error',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }

        log('error', '❌ Update failed', { error: result.error })

        setLastUpdate(result)

        if (onUpdate != null) {
          onUpdate(result)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      log('error', '💥 Update error', { error: errorMessage })

      const result: UpdateResult = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }

      setLastUpdate(result)

      if (onUpdate != null) {
        onUpdate(result)
      }
    } finally {
      isUpdatingRef.current = false
      setIsUpdating(false)
    }
  }, [userId, onUpdate, log])

  /**
   * Schedules the next update with random delay
   */
  const scheduleNext = useCallback((): void => {
    // Clear any existing timeout
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
    }

    const delay = getRandomInterval()
    setNextUpdateIn(delay)

    log('log', `⏰ Next update in ${Math.round(delay / 1000)}s (${Math.round(delay / 60000)} min)`)

    timeoutRef.current = setTimeout(() => {
      void updateMonsters().then(() => {
        scheduleNext() // Schedule next after completion
      })
    }, delay)
  }, [getRandomInterval, updateMonsters, log])

  /**
   * Manual trigger function
   */
  const trigger = useCallback(async (): Promise<void> => {
    await updateMonsters()
    scheduleNext() // Reschedule after manual trigger
  }, [updateMonsters, scheduleNext])

  /**
   * Setup automatic updates
   */
  useEffect(() => {
    // Don't start if disabled or no userId provided
    if (!enabled || userId == null) {
      if (!enabled) {
        log('log', '⏸️ Automatic updates disabled')
      } else {
        log('log', '⏸️ Waiting for user ID')
      }
      return
    }

    log('log', `🚀 Starting automatic updates for user ${userId} (interval: ${Math.round(minInterval / 60000)}-${Math.round(maxInterval / 60000)} min)`)

    // First update immediately, then schedule next
    void updateMonsters().then(() => {
      scheduleNext()
    })

    // Cleanup on unmount
    return () => {
      log('log', '⏹️ Stopping automatic updates')
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, userId, updateMonsters, scheduleNext, log, minInterval, maxInterval])

  return {
    trigger,
    isUpdating,
    lastUpdate,
    updateCount,
    nextUpdateIn
  }
}
