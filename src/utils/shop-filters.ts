/**
 * Shop Filters Utility
 *
 * Pure functions for filtering and sorting shop accessories.
 * Implements Single Responsibility Principle - each function does one thing.
 *
 * @module utils/shop-filters
 */

import type { Accessory, Rarity } from '@/types/accessory.types'

/**
 * Sort order for accessories display
 */
export type SortOrder = 'rarest-first' | 'common-first'

/**
 * Rarity order mapping for sorting
 * Higher number = rarer item
 */
const RARITY_ORDER: Record<Rarity, number> = {
  legendary: 4,
  epic: 3,
  rare: 2,
  uncommon: 1.5,
  common: 1
}

/**
 * Sort accessories by rarity
 *
 * Pure function - does not mutate input array.
 * Follows Single Responsibility: only handles sorting logic.
 *
 * @param accessories - Array of accessories to sort
 * @param order - Sort order (rarest-first or common-first)
 * @returns New sorted array
 *
 * @example
 * ```typescript
 * const sorted = sortByRarity(accessories, 'rarest-first')
 * // Returns: [legendary items, epic items, rare items, common items]
 * ```
 */
export function sortByRarity (
  accessories: Accessory[],
  order: SortOrder
): Accessory[] {
  // Create a copy to avoid mutation (Immutability principle)
  const sorted = [...accessories]

  sorted.sort((a, b) => {
    const rarityA = RARITY_ORDER[a.rarity] ?? 0
    const rarityB = RARITY_ORDER[b.rarity] ?? 0

    if (order === 'rarest-first') {
      return rarityB - rarityA // Descending order
    } else {
      return rarityA - rarityB // Ascending order
    }
  })

  return sorted
}

/**
 * Filter out owned accessories
 *
 * Pure function - does not mutate input.
 * Follows Single Responsibility: only handles filtering logic.
 *
 * @param accessories - Array of accessories to filter
 * @param ownedIds - Array of owned accessory IDs
 * @returns New filtered array
 *
 * @example
 * ```typescript
 * const available = filterOutOwned(accessories, ['hat-cowboy', 'glasses-aviator'])
 * // Returns: Only accessories not in ownedIds
 * ```
 */
export function filterOutOwned (
  accessories: Accessory[],
  ownedIds: string[]
): Accessory[] {
  return accessories.filter(accessory => !ownedIds.includes(accessory.id))
}

/**
 * Apply all filters and sorting to accessories
 *
 * Composes filtering and sorting operations.
 * Follows Dependency Inversion: depends on abstract filter/sort functions.
 *
 * @param accessories - Array of accessories to process
 * @param options - Filter and sort options
 * @returns Processed array of accessories
 *
 * @example
 * ```typescript
 * const processed = applyShopFilters(accessories, {
 *   sortOrder: 'rarest-first',
 *   hideOwned: true,
 *   ownedIds: ['hat-cowboy']
 * })
 * ```
 */
export function applyShopFilters (
  accessories: Accessory[],
  options: {
    sortOrder: SortOrder
    hideOwned: boolean
    ownedIds: string[]
  }
): Accessory[] {
  let result = accessories

  // Apply ownership filter if enabled
  if (options.hideOwned) {
    result = filterOutOwned(result, options.ownedIds)
  }

  // Apply rarity sorting
  result = sortByRarity(result, options.sortOrder)

  return result
}
