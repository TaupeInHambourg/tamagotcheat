/**
 * MonstersAutoUpdater Component
 *
 * Invisible component that manages automatic monster state updates.
 * Should be placed in the app layout to run throughout the app lifecycle.
 *
 * Features:
 * - Schedules periodic updates using the useAutoUpdateMonsters hook
 * - Optional visual indicator for debugging
 * - Automatic user session detection
 *
 * Usage in layout:
 * ```tsx
 * <MonstersAutoUpdater
 *   minInterval={60000}  // 1 minute
 *   maxInterval={180000} // 3 minutes
 *   enabled={true}
 *   verbose={true}
 *   showIndicator={false}
 * />
 * ```
 */

'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

/**
 * Component props
 */
interface MonstersAutoUpdaterProps {
  /** User ID for filtering updates */
  userId?: string | null
  /** Minimum interval between updates in ms */
  minInterval?: number
  /** Maximum interval between updates in ms */
  maxInterval?: number
  /** Enable/disable automatic updates */
  enabled?: boolean
  /** Enable verbose console logging */
  verbose?: boolean
  /** Show visual indicator (for debugging) */
  showIndicator?: boolean
}

/**
 * Auto-updater component
 */
export function MonstersAutoUpdater ({
  userId = null,
  minInterval = 60000,
  maxInterval = 180000,
  enabled = true,
  verbose = false,
  showIndicator = false
}: MonstersAutoUpdaterProps): React.ReactNode {
  const {
    isUpdating,
    lastUpdate,
    updateCount,
    nextUpdateIn
  } = useAutoUpdateMonsters({
    userId,
    minInterval,
    maxInterval,
    enabled,
    verbose
  })

  // Return null if indicator is disabled
  if (!showIndicator) {
    return null
  }

  // Visual indicator for debugging
  return (
    <div
      className='fixed bottom-4 right-4 z-50 rounded-lg bg-black/80 p-3 text-xs text-white shadow-lg backdrop-blur-sm'
      role='status'
      aria-live='polite'
    >
      <div className='flex items-center gap-2'>
        <div className={`h-2 w-2 rounded-full ${isUpdating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
        <span className='font-semibold'>Auto-Update</span>
      </div>

      <div className='mt-2 space-y-1 text-gray-300'>
        <div>Updates: {updateCount}</div>
        {lastUpdate != null && (
          <div>
            Last: {lastUpdate.success ? '✅' : '❌'} {lastUpdate.updated ?? 0} monsters
          </div>
        )}
        {nextUpdateIn != null && !isUpdating && (
          <div>Next: {Math.round(nextUpdateIn / 1000)}s</div>
        )}
        {isUpdating && <div>Updating...</div>}
      </div>
    </div>
  )
}
