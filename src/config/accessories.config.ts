/**
 * Accessories Configuration
 *
 * Central configuration for the accessories system.
 * Includes catalog of available accessories and utility functions.
 *
 * Following Clean Architecture:
 * - Configuration layer (external concerns)
 * - Open/Closed Principle: New accessories can be added without modifying functions
 * - Single Responsibility: Only handles accessory catalog and related utilities
 */

import type {
  Accessory,
  Rarity,
  RarityConfig,
  CategoryConfig,
  AccessoryCategory
} from '@/types/accessory.types'

/**
 * Rarity configuration map
 *
 * Defines the properties and multipliers for each rarity level.
 * Open/Closed: New rarities can be added here without changing logic.
 */
export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  common: {
    name: 'Commun',
    color: 'from-chestnut-soft to-chestnut-medium',
    emoji: '⚪',
    priceMultiplier: 1,
    dropRate: 50,
    order: 1
  },
  uncommon: {
    name: 'Peu commun',
    color: 'from-moss-soft to-moss-medium',
    emoji: '🟢',
    priceMultiplier: 1.5,
    dropRate: 30,
    order: 2
  },
  rare: {
    name: 'Rare',
    color: 'from-pastel-sky to-monster-blue',
    emoji: '🔵',
    priceMultiplier: 2,
    dropRate: 15,
    order: 3
  },
  epic: {
    name: 'Épique',
    color: 'from-pastel-lavender to-monster-purple',
    emoji: '🟣',
    priceMultiplier: 3,
    dropRate: 4,
    order: 4
  },
  legendary: {
    name: 'Légendaire',
    color: 'from-autumn-coral to-maple-warm',
    emoji: '🟡',
    priceMultiplier: 5,
    dropRate: 1,
    order: 5
  }
}

/**
 * Category configuration
 *
 * Defines display properties for each accessory category.
 */
export const CATEGORY_CONFIG: Record<AccessoryCategory, CategoryConfig> = {
  hat: {
    id: 'hat',
    name: 'Chapeaux',
    emoji: '🎩'
  },
  glasses: {
    id: 'glasses',
    name: 'Lunettes',
    emoji: '👓'
  },
  shoes: {
    id: 'shoes',
    name: 'Chaussures',
    emoji: '👟'
  }
}

/**
 * Accessories catalog
 *
 * Complete list of all available accessories.
 * This is mock data - in the future, this could come from a database.
 */
export const ACCESSORIES_CATALOG: Accessory[] = [
  // ========== CHAPEAUX (Hats) ==========
  {
    id: 'hat-cowboy',
    name: 'Chapeau de Cowboy',
    category: 'hat',
    emoji: '🤠',
    rarity: 'common',
    basePrice: 10,
    description: 'Yeehaw ! Pour les créatures aventurières',
    style: { top: '-15%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'hat-crown',
    name: 'Couronne Royale',
    category: 'hat',
    emoji: '👑',
    rarity: 'legendary',
    basePrice: 20,
    description: 'Pour les créatures de sang royal',
    style: { top: '-20%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'hat-cap',
    name: 'Casquette',
    category: 'hat',
    emoji: '🧢',
    rarity: 'common',
    basePrice: 8,
    description: 'Style décontracté garanti',
    style: { top: '-12%', left: '50%', transform: 'translateX(-50%) rotate(-10deg)' }
  },
  {
    id: 'hat-wizard',
    name: 'Chapeau de Magicien',
    category: 'hat',
    emoji: '🎩',
    rarity: 'epic',
    basePrice: 15,
    description: 'Pour les créatures magiques',
    style: { top: '-18%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'hat-party',
    name: 'Chapeau de Fête',
    category: 'hat',
    emoji: '🎉',
    rarity: 'uncommon',
    basePrice: 12,
    description: 'Toujours prêt à faire la fête',
    style: { top: '-15%', left: '50%', transform: 'translateX(-50%) rotate(15deg)' }
  },
  {
    id: 'hat-beret',
    name: 'Béret Parisien',
    category: 'hat',
    emoji: '🎨',
    rarity: 'rare',
    basePrice: 14,
    description: 'Très artistique et français',
    style: { top: '-10%', left: '45%', transform: 'translateX(-50%) rotate(-20deg)' }
  },

  // ========== LUNETTES (Glasses) ==========
  {
    id: 'glasses-sun',
    name: 'Lunettes de Soleil',
    category: 'glasses',
    emoji: '🕶️',
    rarity: 'common',
    basePrice: 10,
    description: 'Trop cool pour l\'école',
    style: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-nerd',
    name: 'Lunettes de Geek',
    category: 'glasses',
    emoji: '🤓',
    rarity: 'uncommon',
    basePrice: 10,
    description: '+10 en intelligence',
    style: { top: '28%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-heart',
    name: 'Lunettes Cœur',
    category: 'glasses',
    emoji: '😍',
    rarity: 'rare',
    basePrice: 12,
    description: 'Pour voir le monde avec amour',
    style: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-monocle',
    name: 'Monocle',
    category: 'glasses',
    emoji: '🧐',
    rarity: 'epic',
    basePrice: 16,
    description: 'Très distingué',
    style: { top: '30%', left: '55%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-3d',
    name: 'Lunettes 3D',
    category: 'glasses',
    emoji: '🎬',
    rarity: 'rare',
    basePrice: 12,
    description: 'Pour voir le monde différemment',
    style: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
  },

  // ========== CHAUSSURES (Shoes) ==========
  {
    id: 'shoes-sneakers',
    name: 'Baskets',
    category: 'shoes',
    emoji: '👟',
    rarity: 'common',
    basePrice: 10,
    description: 'Confortables et stylées',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-boots',
    name: 'Bottes de Cowboy',
    category: 'shoes',
    emoji: '🥾',
    rarity: 'uncommon',
    basePrice: 10,
    description: 'Parfaites pour l\'aventure',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-ballet',
    name: 'Chaussons de Danse',
    category: 'shoes',
    emoji: '🩰',
    rarity: 'rare',
    basePrice: 12,
    description: 'Pour danser avec grâce',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-roller',
    name: 'Patins à Roulettes',
    category: 'shoes',
    emoji: '🛼',
    rarity: 'epic',
    basePrice: 16,
    description: 'Vitesse et style',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-heels',
    name: 'Talons Hauts',
    category: 'shoes',
    emoji: '👠',
    rarity: 'uncommon',
    basePrice: 11,
    description: 'Élégance incarnée',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-flip-flops',
    name: 'Tongs',
    category: 'shoes',
    emoji: '🩴',
    rarity: 'common',
    basePrice: 8,
    description: 'Détente garantie',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  }
]

/**
 * Utility Functions
 */

/**
 * Get rarity configuration
 *
 * Dependency Inversion: Depends on abstraction (Rarity type) not implementation.
 *
 * @param rarity - The rarity level to look up
 * @returns Configuration for the specified rarity
 */
export function getRarityConfig (rarity: Rarity): RarityConfig {
  return RARITY_CONFIG[rarity]
}

/**
 * Get accessory by ID
 *
 * Single Responsibility: Only retrieves accessory data.
 *
 * @param id - The unique identifier of the accessory
 * @returns The accessory if found, undefined otherwise
 */
export function getAccessoryById (id: string): Accessory | undefined {
  return ACCESSORIES_CATALOG.find(accessory => accessory.id === id)
}

/**
 * Calculate final price for an accessory
 *
 * Applies rarity multiplier to base price.
 * Open/Closed: Can be extended with discounts, sales, etc. without modification.
 *
 * @param accessory - The accessory to calculate price for
 * @returns Final price after applying rarity multiplier
 */
export function getAccessoryPrice (accessory: Accessory): number {
  const rarityConfig = getRarityConfig(accessory.rarity)
  return Math.round(accessory.basePrice * rarityConfig.priceMultiplier)
}

/**
 * Get accessories by category
 *
 * Single Responsibility: Filters accessories by category.
 *
 * @param category - The category to filter by
 * @returns Array of accessories in the specified category
 */
export function getAccessoriesByCategory (category: AccessoryCategory): Accessory[] {
  return ACCESSORIES_CATALOG.filter(accessory => accessory.category === category)
}

/**
 * Get accessories sorted by rarity
 *
 * @param descending - If true, sorts from legendary to common. Default: true
 * @returns Sorted array of accessories
 */
export function getAccessoriesByRarity (descending: boolean = true): Accessory[] {
  return [...ACCESSORIES_CATALOG].sort((a, b) => {
    const rarityA = getRarityConfig(a.rarity).order
    const rarityB = getRarityConfig(b.rarity).order
    return descending ? rarityB - rarityA : rarityA - rarityB
  })
}

/**
 * Get category configuration
 *
 * @param category - The category to get config for
 * @returns Configuration for the specified category
 */
export function getCategoryConfig (category: AccessoryCategory): CategoryConfig {
  return CATEGORY_CONFIG[category]
}
