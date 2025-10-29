/**
 * Monster State Decay Utility
 *
 * Handles the computation of monster states based on elapsed time.
 * Each monster has its own independent timer for state changes.
 *
 * Business Rules:
 * - Each monster changes state randomly between 30 seconds and 5 minutes
 * - State changes are computed lazily (on read) rather than with a background job
 * - Each monster's next change time is random and independent
 * - 'happy' state can only be achieved through user interactions
 *
 * @module monster-state-decay
 */

import type { Monster, MonsterState } from '@/types/monster.types'

/**
 * Minimum time before state change (30 seconds in milliseconds)
 */
const MIN_STATE_CHANGE_INTERVAL = 30 * 1000 // 30 seconds

/**
 * Maximum time before state change (5 minutes in milliseconds)
 */
const MAX_STATE_CHANGE_INTERVAL = 5 * 60 * 1000 // 5 minutes

/**
 * Available states for random selection (excluding 'happy')
 * 'happy' can only be achieved through user interactions
 */
const DECAY_STATES: MonsterState[] = ['sad', 'angry', 'hungry', 'sleepy']

/**
 * Generates a random interval between min and max
 * @returns Random milliseconds between MIN and MAX intervals
 */
function getRandomInterval (): number {
  return Math.floor(
    Math.random() * (MAX_STATE_CHANGE_INTERVAL - MIN_STATE_CHANGE_INTERVAL + 1)
  ) + MIN_STATE_CHANGE_INTERVAL
}

/**
 * Selects a random state from decay states
 * @param currentState - Current state to potentially exclude
 * @returns A random monster state
 */
function getRandomState (currentState?: MonsterState): MonsterState {
  // Filter out current state to ensure change
  const availableStates = currentState != null
    ? DECAY_STATES.filter(s => s !== currentState)
    : DECAY_STATES

  const randomIndex = Math.floor(Math.random() * availableStates.length)
  return availableStates[randomIndex]
}

/**
 * Computes the next state change timestamp
 * @returns Date object for when the next state change should occur
 */
export function computeNextStateChangeAt (): Date {
  const now = Date.now()
  const interval = getRandomInterval()
  return new Date(now + interval)
}

/**
 * State change result
 */
export interface StateChangeResult {
  /** Whether the state was changed */
  changed: boolean
  /** The new state (may be same as old if not changed) */
  state: MonsterState
  /** The new nextStateChangeAt timestamp */
  nextStateChangeAt: Date
  /** The new lastStateChange timestamp (only if changed) */
  lastStateChange?: Date
}

/**
 * Computes the current state of a monster based on elapsed time
 *
 * This function implements the lazy update pattern:
 * 1. Checks if enough time has passed since last state change
 * 2. If yes, computes a new random state and updates timing
 * 3. If no, returns current state unchanged
 *
 * @param monster - The monster to compute state for
 * @returns State change result with updated fields
 *
 * @example
 * const result = computeCurrentState(monster)
 * if (result.changed) {
 *   // Update monster in database
 *   await updateMonster(monster.id, {
 *     state: result.state,
 *     lastStateChange: result.lastStateChange,
 *     nextStateChangeAt: result.nextStateChangeAt
 *   })
 * }
 */
export function computeCurrentState (monster: Monster): StateChangeResult {
  const now = new Date()

  // Initialize timing fields if missing (for existing monsters)
  if (monster.nextStateChangeAt == null) {
    return {
      changed: true,
      state: monster.state,
      nextStateChangeAt: computeNextStateChangeAt(),
      lastStateChange: now
    }
  }

  // Check if it's time for a state change
  const nextChangeTime = new Date(monster.nextStateChangeAt)
  const shouldChange = now >= nextChangeTime

  if (shouldChange) {
    // Time to change state
    const newState = getRandomState(monster.state)

    return {
      changed: true,
      state: newState,
      nextStateChangeAt: computeNextStateChangeAt(),
      lastStateChange: now
    }
  }

  // No change needed yet
  return {
    changed: false,
    state: monster.state,
    nextStateChangeAt: nextChangeTime
  }
}

/**
 * Initializes timing fields for a new monster
 * Should be called when creating a new monster
 *
 * @param initialState - The initial state of the monster (default: 'happy')
 * @returns Object with initialized timing fields
 *
 * @example
 * const timingFields = initializeMonsterTiming('happy')
 * await createMonster({
 *   name: 'Fluffy',
 *   ...timingFields
 * })
 */
export function initializeMonsterTiming (initialState: MonsterState = 'happy'): {
  state: MonsterState
  lastStateChange: Date
  nextStateChangeAt: Date
} {
  const now = new Date()

  return {
    state: initialState,
    lastStateChange: now,
    nextStateChangeAt: computeNextStateChangeAt()
  }
}

/**
 * Gets the time remaining until next state change
 * Useful for UI display
 *
 * @param monster - The monster to check
 * @returns Milliseconds until next change, or 0 if overdue
 *
 * @example
 * const msRemaining = getTimeUntilNextChange(monster)
 * const secondsRemaining = Math.floor(msRemaining / 1000)
 * console.log(`Next change in ${secondsRemaining} seconds`)
 */
export function getTimeUntilNextChange (monster: Monster): number {
  if (monster.nextStateChangeAt == null) {
    return 0
  }

  const now = Date.now()
  const nextChange = new Date(monster.nextStateChangeAt).getTime()
  const remaining = nextChange - now

  return Math.max(0, remaining)
}
