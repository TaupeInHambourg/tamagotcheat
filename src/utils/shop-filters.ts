/**
 * Shop Filters Utility
 *
 * Pure functions for filtering and sorting shop items (accessories, backgrounds, etc.).
 * Implements Single Responsibility Principle - each function does one thing.
 *
 * @module utils/shop-filters
 */

import type { Rarity } from '@/types/accessory.types'

/**
 * Generic item type with rarity and id (for filtering/sorting)
 * This interface constraint ensures type safety for shop operations
 */
interface ShopItem { id: string, rarity: Rarity }

/**
 * Sort order for items display
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
 * Sort items by rarity (generic function)
 *
 * Pure function - does not mutate input array.
 * Follows Single Responsibility: only handles sorting logic.
 * Works with any item type that has a rarity property.
 *
 * @param items - Array of items to sort
 * @param order - Sort order (rarest-first or common-first)
 * @returns New sorted array
 *
 * @example
 * ```typescript
 * const sorted = sortByRarity(accessories, 'rarest-first')
 * // Returns: [legendary items, epic items, rare items, common items]
 * ```
 */
export function sortByRarity<T extends ShopItem> (
  items: T[],
  order: SortOrder
): T[] {
  // Create a copy to avoid mutation (Immutability principle)
  const sorted = [...items]

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
 * Filter out owned items (generic function)
 *
 * Pure function - does not mutate input.
 * Follows Single Responsibility: only handles filtering logic.
 * Works with any item type that has an id property.
 *
 * @param items - Array of items to filter
 * @param ownedIds - Array of owned item IDs
 * @returns New filtered array
 *
 * @example
 * ```typescript
 * const available = filterOutOwned(accessories, ['hat-cowboy', 'glasses-aviator'])
 * // Returns: Only items not in ownedIds
 * ```
 */
export function filterOutOwned<T extends ShopItem> (
  items: T[],
  ownedIds: string[]
): T[] {
  return items.filter(item => !ownedIds.includes(item.id))
}

/**
 * Apply all filters and sorting to shop items (generic function)
 *
 * Composes filtering and sorting operations.
 * Follows Dependency Inversion: depends on abstract filter/sort functions.
 * Works with accessories, backgrounds, or any shop item type.
 *
 * @param items - Array of items to process
 * @param options - Filter and sort options
 * @returns Processed array of items
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
export function applyShopFilters<T extends ShopItem> (
  items: T[],
  options: {
    sortOrder: SortOrder
    hideOwned: boolean
    ownedIds: string[]
  }
): T[] {
  let result = items

  // Apply ownership filter if enabled
  if (options.hideOwned) {
    result = filterOutOwned(result, options.ownedIds)
  }

  // Apply rarity sorting
  result = sortByRarity(result, options.sortOrder)

  return result
}
