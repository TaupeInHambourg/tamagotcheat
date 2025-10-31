/**
 * Accessory Types and Interfaces
 *
 * Defines all type definitions related to accessories in the application.
 * Includes domain models, rarity system, and configuration.
 *
 * Following Clean Architecture principles:
 * - Domain entities (Accessory, OwnedAccessory)
 * - Value objects (Rarity, AccessoryCategory)
 * - Configuration (RarityConfig)
 */

/**
 * Available accessory categories
 * Represents the different types of accessories that can be equipped
 */
export type AccessoryCategory = 'hat' | 'glasses' | 'shoes'

/**
 * Rarity levels for accessories
 * Determines the value, appearance, and desirability of accessories
 */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

/**
 * Rarity configuration
 *
 * Defines the visual and gameplay properties for each rarity level.
 * Open/Closed Principle: New rarities can be added without modifying existing code.
 */
export interface RarityConfig {
  /** Display name of the rarity level */
  name: string
  /** Tailwind gradient classes for visual representation */
  color: string
  /** Emoji icon representing the rarity */
  emoji: string
  /** Price multiplier applied to base price (1 = base price) */
  priceMultiplier: number
  /** Drop rate percentage for random acquisition (future use) */
  dropRate: number
  /** Display order (lower = more common) */
  order: number
}

/**
 * Accessory catalog item
 *
 * Represents an accessory available for purchase or acquisition.
 * Single Responsibility: Only contains accessory definition data.
 */
export interface Accessory {
  /** Unique identifier for the accessory */
  id: string
  /** Display name of the accessory */
  name: string
  /** Category this accessory belongs to */
  category: AccessoryCategory
  /** Emoji representation of the accessory */
  emoji: string
  /** Rarity level */
  rarity: Rarity
  /** Base price in coins (will be multiplied by rarity multiplier) */
  basePrice: number
  /** Short description of the accessory */
  description: string
  /** Optional CSS positioning for when accessory is equipped (future use) */
  style?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
    transform?: string
    scale?: string
  }
}

/**
 * User-owned accessory
 *
 * Represents an accessory that a user has acquired and can equip.
 * Includes ownership and equipment state.
 */
export interface OwnedAccessory {
  /** Unique identifier for this ownership record */
  _id: string
  /** User who owns this accessory */
  ownerId: string
  /** Reference to the accessory catalog item */
  accessoryId: string
  /** Monster this accessory is equipped on (null if not equipped) */
  equippedOnMonsterId: string | null
  /** When the accessory was acquired */
  acquiredAt: Date
}

/**
 * Category display configuration
 *
 * Defines how each category should be displayed in the UI.
 * Interface Segregation: Separate from Accessory to keep concerns isolated.
 */
export interface CategoryConfig {
  /** Category identifier */
  id: AccessoryCategory
  /** Display name */
  name: string
  /** Emoji icon */
  emoji: string
}
