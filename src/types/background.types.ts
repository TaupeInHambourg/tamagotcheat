/**
 * Background Types
 *
 * Type definitions for the background system.
 * Follows the same pattern as accessory.types.ts for consistency.
 *
 * Design Principles:
 * - Interface Segregation: Small, focused interfaces
 * - Open/Closed: Easy to extend with new background types
 * - Single Responsibility: Each type has one clear purpose
 *
 * @module types/background
 */

/**
 * Background rarity levels
 * Same as accessories for consistency
 */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

/**
 * Background theme categories
 */
export type BackgroundCategory = 'nature' | 'abstract' | 'pattern' | 'sky'

/**
 * Base background configuration
 */
export interface Background {
  /** Unique identifier (e.g., "bg-autumn-forest") */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Rarity level */
  rarity: Rarity
  /** Theme category */
  category: BackgroundCategory
  /** Base price in Koins (before rarity multiplier) */
  basePrice: number
  /** Asset path relative to /assets/backgrounds/ */
  assetPath: string
}

/**
 * Rarity configuration
 * Shared with accessories for price consistency
 */
export interface RarityConfig {
  name: string
  color: string
  emoji: string
  priceMultiplier: number
  dropRate: number
  order: number
}

/**
 * Category configuration for UI display
 */
export interface CategoryConfig {
  id: BackgroundCategory
  name: string
  emoji: string
  description: string
}

/**
 * Database model for owned backgrounds
 */
export interface BackgroundDB {
  _id: string
  userId: string
  backgroundId: string
  purchasedAt: Date
  equippedTo?: string | null // monsterId if equipped
}

/**
 * Background equipped to a monster
 */
export interface EquippedBackground {
  backgroundId: string
  backgroundDbId: string
}
