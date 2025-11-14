/**
 * Experience System for Monster Progression
 *
 * Manages the XP and leveling system for monsters.
 * Follows Clean Code principles with pure functions and clear separation of concerns.
 *
 * Architecture:
 * - Pure functions (no side effects)
 * - Single Responsibility (each function does one thing)
 * - Immutable calculations (returns new values)
 *
 * Inspired by: https://github.com/RiusmaX/v0-tamagotcho/
 */

/**
 * XP rewards for different monster actions
 * Each interaction grants a specific amount of experience
 */
export const XP_PER_ACTION = {
  play: 25,
  feed: 15,
  sleep: 5,
  cuddle: 10
} as const

/**
 * XP reward for equipping an accessory
 */
export const XP_PER_ACCESSORY = 20

/**
 * Maximum level a monster can achieve
 */
export const MAX_LEVEL = 50

/**
 * Calculate XP required to advance from a specific level to the next
 *
 * Formula: level * 100
 * - Level 1→2 requires 100 XP
 * - Level 2→3 requires 200 XP
 * - Level 3→4 requires 300 XP
 * - etc.
 *
 * This creates a linear progression that's easy to understand
 * and scales predictably.
 *
 * @param level - The current level
 * @returns XP required to reach the next level
 */
export function getXPRequiredForLevel (level: number): number {
  if (level >= MAX_LEVEL) return 0
  return level * 100
}

/**
 * Calculate total XP required to reach a specific level from level 1
 *
 * @param level - Target level
 * @returns Total XP needed from level 1 to reach target level
 *
 * @example
 * getTotalXPForLevel(1) // 0 (already at level 1)
 * getTotalXPForLevel(2) // 100 (1 * 100)
 * getTotalXPForLevel(3) // 300 (100 + 200)
 * getTotalXPForLevel(4) // 600 (100 + 200 + 300)
 */
export function getTotalXPForLevel (level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPRequiredForLevel(i)
  }
  return total
}

/**
 * Calculate level and remaining XP from total accumulated XP
 *
 * This is the core function for determining a monster's progression state.
 *
 * @param totalXP - Total accumulated experience points
 * @returns Object containing current level, XP within current level, and XP needed for next level
 *
 * @example
 * calculateLevelFromXP(0)    // { level: 1, currentXP: 0, xpForNextLevel: 100 }
 * calculateLevelFromXP(150)  // { level: 2, currentXP: 50, xpForNextLevel: 200 }
 * calculateLevelFromXP(1000) // { level: 4, currentXP: 400, xpForNextLevel: 400 }
 */
export function calculateLevelFromXP (totalXP: number): {
  level: number
  currentXP: number
  xpForNextLevel: number
} {
  let level = 1
  let remainingXP = totalXP

  // Determine level by subtracting XP requirements
  while (level < MAX_LEVEL) {
    const xpRequired = getXPRequiredForLevel(level)
    if (remainingXP < xpRequired) {
      break
    }
    remainingXP -= xpRequired
    level++
  }

  // Calculate XP needed for the next level
  const xpForNextLevel = level < MAX_LEVEL ? getXPRequiredForLevel(level) : 0

  return {
    level,
    currentXP: remainingXP,
    xpForNextLevel
  }
}

/**
 * Add XP to a monster and calculate the new progression state
 *
 * This function handles:
 * - Adding XP to the total
 * - Recalculating level
 * - Determining if a level-up occurred
 * - Respecting MAX_LEVEL cap
 *
 * @param currentTotalXP - Current total accumulated XP
 * @param xpToAdd - Amount of XP to add
 * @returns Complete progression state including old/new levels and level-up status
 *
 * @example
 * addXP(0, 150)
 * // {
 * //   newTotalXP: 150,
 * //   newLevel: 2,
 * //   newCurrentXP: 50,
 * //   xpForNextLevel: 200,
 * //   leveledUp: true,
 * //   oldLevel: 1
 * // }
 */
export function addXP (
  currentTotalXP: number,
  xpToAdd: number
): {
    newTotalXP: number
    newLevel: number
    newCurrentXP: number
    xpForNextLevel: number
    leveledUp: boolean
    oldLevel: number
  } {
  // Calculate old state before adding XP
  const oldLevelInfo = calculateLevelFromXP(currentTotalXP)

  // Add XP and cap at MAX_LEVEL total
  const newTotalXP = Math.min(
    currentTotalXP + xpToAdd,
    getTotalXPForLevel(MAX_LEVEL)
  )

  // Calculate new state after adding XP
  const newLevelInfo = calculateLevelFromXP(newTotalXP)

  return {
    newTotalXP,
    newLevel: newLevelInfo.level,
    newCurrentXP: newLevelInfo.currentXP,
    xpForNextLevel: newLevelInfo.xpForNextLevel,
    leveledUp: newLevelInfo.level > oldLevelInfo.level,
    oldLevel: oldLevelInfo.level
  }
}

/**
 * Calculate progress percentage for current level
 *
 * Used for progress bars and visual feedback.
 *
 * @param currentXP - XP within the current level
 * @param xpForNextLevel - Total XP required for next level
 * @returns Percentage (0-100) of progress within current level
 *
 * @example
 * getLevelProgress(50, 200)  // 25
 * getLevelProgress(150, 300) // 50
 * getLevelProgress(0, 0)     // 100 (max level reached)
 */
export function getLevelProgress (currentXP: number, xpForNextLevel: number): number {
  if (xpForNextLevel === 0) return 100 // Max level reached
  return Math.round((currentXP / xpForNextLevel) * 100)
}
