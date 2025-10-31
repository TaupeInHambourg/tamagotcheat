/**
 * Dashboard Statistics Utilities
 *
 * Provides pure functions to calculate dashboard statistics from monster data.
 * Following Single Responsibility Principle - each function has one clear purpose.
 *
 * These utilities are:
 * - Pure functions (no side effects)
 * - Testable in isolation
 * - Reusable across components
 */

import type { Monster } from '@/types/monster.types'

/**
 * Result of finding the highest level monster
 */
export interface HighestLevelMonster {
  monster: Monster
  level: number
}

/**
 * Result of finding the most recently adopted monster
 */
export interface LatestAdoptedMonster {
  monster: Monster
  adoptedAt: Date
}

/**
 * Finds the monster with the highest level.
 * If multiple monsters have the same level, returns the one with most experience.
 *
 * @param monsters - Array of monsters to search
 * @returns The highest level monster or null if array is empty
 *
 * @example
 * ```typescript
 * const highest = findHighestLevelMonster(monsters)
 * if (highest) {
 *   console.log(`${highest.monster.name} is level ${highest.level}`)
 * }
 * ```
 */
export function findHighestLevelMonster (monsters: Monster[]): HighestLevelMonster | null {
  if (!Array.isArray(monsters) || monsters.length === 0) {
    return null
  }

  let highestMonster: Monster | null = null
  let highestLevel = 0
  let highestExperience = 0

  monsters.forEach((monster) => {
    const level = monster.level ?? 1
    const experience = monster.totalExperience ?? monster.experience ?? 0

    // Update if this monster has a higher level
    // Or same level but more experience
    if (level > highestLevel || (level === highestLevel && experience > highestExperience)) {
      highestMonster = monster
      highestLevel = level
      highestExperience = experience
    }
  })

  if (highestMonster === null) {
    return null
  }

  return {
    monster: highestMonster,
    level: highestLevel
  }
}

/**
 * Finds the most recently adopted (created) monster.
 *
 * @param monsters - Array of monsters to search
 * @returns The latest adopted monster or null if array is empty
 *
 * @example
 * ```typescript
 * const latest = findLatestAdoptedMonster(monsters)
 * if (latest) {
 *   console.log(`${latest.monster.name} was adopted on ${latest.adoptedAt}`)
 * }
 * ```
 */
export function findLatestAdoptedMonster (monsters: Monster[]): LatestAdoptedMonster | null {
  if (!Array.isArray(monsters) || monsters.length === 0) {
    return null
  }

  let latestMonster: Monster | null = null
  let latestDate: Date | null = null

  monsters.forEach((monster) => {
    const dateString = monster.createdAt ?? monster.updatedAt
    if (dateString === undefined) {
      return
    }

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return
    }

    if (latestDate === null || date > latestDate) {
      latestMonster = monster
      latestDate = date
    }
  })

  if (latestMonster === null || latestDate === null) {
    return null
  }

  return {
    monster: latestMonster,
    adoptedAt: latestDate
  }
}

/**
 * Formats a date to a human-readable French format
 *
 * @param date - The date to format
 * @returns Formatted date string (e.g., "31 octobre 2025")
 */
export function formatAdoptionDate (date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
