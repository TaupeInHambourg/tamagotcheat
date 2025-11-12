/**
 * Backgrounds Configuration
 *
 * Central configuration for the backgrounds system.
 * Includes catalog of available backgrounds and utility functions.
 *
 * Following Clean Architecture:
 * - Configuration layer (external concerns)
 * - Open/Closed Principle: New backgrounds can be added without modifying functions
 * - Single Responsibility: Only handles background catalog and related utilities
 */

import type {
  Background,
  Rarity,
  RarityConfig,
  CategoryConfig,
  BackgroundCategory
} from '@/types/background.types'

/**
 * Rarity configuration map
 *
 * Shared configuration with accessories for consistency.
 * Defines the properties and multipliers for each rarity level.
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
 * Defines display properties for each background category.
 */
export const CATEGORY_CONFIG: Record<BackgroundCategory, CategoryConfig> = {
  nature: {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    description: 'Paysages naturels et forestiers'
  },
  abstract: {
    id: 'abstract',
    name: 'Abstrait',
    emoji: '🎨',
    description: 'Designs artistiques et dégradés'
  },
  pattern: {
    id: 'pattern',
    name: 'Motifs',
    emoji: '📐',
    description: 'Patterns géométriques et pixel art'
  },
  sky: {
    id: 'sky',
    name: 'Ciel',
    emoji: '☁️',
    description: 'Ciels étoilés et couchers de soleil'
  }
}

/**
 * Backgrounds catalog
 *
 * Complete list of all available backgrounds.
 * Each background is mapped to an SVG asset in /assets/backgrounds/
 */
export const BACKGROUNDS_CATALOG: Background[] = [
  // ========== NATURE ==========
  {
    id: 'bg-autumn-forest',
    name: 'Forêt d\'Automne',
    description: 'Une forêt aux couleurs chaudes de l\'automne',
    rarity: 'rare',
    category: 'nature',
    basePrice: 100,
    assetPath: '/assets/backgrounds/bg_autumn_forest.svg'
  },
  {
    id: 'bg-pastel-meadow',
    name: 'Prairie Pastel',
    description: 'Une prairie douce aux couleurs pastels',
    rarity: 'uncommon',
    category: 'nature',
    basePrice: 80,
    assetPath: '/assets/backgrounds/bg_pastel_meadow.svg'
  },

  // ========== SKY ==========
  {
    id: 'bg-starry-sky',
    name: 'Ciel Étoilé',
    description: 'Un ciel nocturne rempli d\'étoiles scintillantes',
    rarity: 'epic',
    category: 'sky',
    basePrice: 150,
    assetPath: '/assets/backgrounds/bg_starry_sky.svg'
  },
  {
    id: 'bg-sunset',
    name: 'Coucher de Soleil',
    description: 'Un magnifique coucher de soleil aux teintes chaudes',
    rarity: 'rare',
    category: 'sky',
    basePrice: 100,
    assetPath: '/assets/backgrounds/bg_sunset.svg'
  },

  // ========== ABSTRACT ==========
  {
    id: 'bg-gradient-autumn',
    name: 'Dégradé Automnal',
    description: 'Un dégradé doux aux couleurs de l\'automne',
    rarity: 'common',
    category: 'abstract',
    basePrice: 50,
    assetPath: '/assets/backgrounds/bg_gradient_autumn.svg'
  },
  {
    id: 'bg-geometric-pastel',
    name: 'Géométrie Pastel',
    description: 'Des formes géométriques aux couleurs pastels',
    rarity: 'uncommon',
    category: 'abstract',
    basePrice: 80,
    assetPath: '/assets/backgrounds/bg_geometric_pastel.svg'
  },

  // ========== PATTERN ==========
  {
    id: 'bg-pixel-grid',
    name: 'Grille Pixel',
    description: 'Un motif pixel art style rétro',
    rarity: 'common',
    category: 'pattern',
    basePrice: 50,
    assetPath: '/assets/backgrounds/bg_pixel_grid.svg'
  },
  {
    id: 'bg-dots-stripes',
    name: 'Pois et Rayures',
    description: 'Un motif cosy avec pois et rayures',
    rarity: 'common',
    category: 'pattern',
    basePrice: 50,
    assetPath: '/assets/backgrounds/bg_dots_stripes.svg'
  }
]

/**
 * Calculate final price for a background
 *
 * Pure function that applies rarity multiplier to base price.
 * Follows Open/Closed: price calculation logic is isolated and extensible.
 *
 * @param background - The background to price
 * @returns Final price in Koins
 *
 * @example
 * ```typescript
 * const bg = BACKGROUNDS_CATALOG.find(b => b.id === 'bg-starry-sky')
 * const price = getBackgroundPrice(bg) // 150 * 3 = 450 Koins
 * ```
 */
export function getBackgroundPrice (background: Background): number {
  const rarityConfig = RARITY_CONFIG[background.rarity]
  return Math.round(background.basePrice * rarityConfig.priceMultiplier)
}

/**
 * Get background by ID
 *
 * @param id - Background identifier
 * @returns Background if found, undefined otherwise
 */
export function getBackgroundById (id: string): Background | undefined {
  return BACKGROUNDS_CATALOG.find(bg => bg.id === id)
}

/**
 * Get all backgrounds by category
 *
 * @param category - Category to filter by
 * @returns Array of backgrounds in the category
 */
export function getBackgroundsByCategory (category: BackgroundCategory): Background[] {
  return BACKGROUNDS_CATALOG.filter(bg => bg.category === category)
}

/**
 * Get all backgrounds by rarity
 *
 * @param rarity - Rarity to filter by
 * @returns Array of backgrounds with the rarity
 */
export function getBackgroundsByRarity (rarity: Rarity): Background[] {
  return BACKGROUNDS_CATALOG.filter(bg => bg.rarity === rarity)
}
