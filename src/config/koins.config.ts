/**
 * Koins Configuration
 *
 * Defines the available Koins packages for purchase.
 * Each package includes pricing, quantity, and metadata for Stripe integration.
 *
 * Architecture:
 * - Single Responsibility: Product catalog definition only
 * - Open/Closed: New packages can be added without modifying existing ones
 * - Interface Segregation: Clean product interface
 *
 * @module config
 */

export interface KoinsPackage {
  /** Unique identifier for Stripe product */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Number of Koins awarded */
  koins: number
  /** Price in cents (Stripe uses cents for precision) */
  priceInCents: number
  /** Whether this package is highlighted as popular */
  popular?: boolean
  /** Emoji icon for visual display */
  emoji: string
}

/**
 * Available Koins packages for purchase
 *
 * Prices follow a discounted scaling model:
 * - Smaller packages: Higher cost per Koin
 * - Larger packages: Better value per Koin
 *
 * This encourages larger purchases while keeping entry affordable.
 */
export const KOINS_PACKAGES: KoinsPackage[] = [
  {
    id: 'koins-50',
    name: 'Petit Sac',
    description: '50 Koins pour débuter',
    koins: 50,
    priceInCents: 199, // 1.99€ = ~0.04€ per Koin
    emoji: '🪙'
  },
  {
    id: 'koins-100',
    name: 'Sac Standard',
    description: '100 Koins pour progresser',
    koins: 100,
    priceInCents: 299, // 2.99€ = ~0.03€ per Koin
    popular: true,
    emoji: '💰'
  },
  {
    id: 'koins-250',
    name: 'Grand Sac',
    description: '250 Koins pour les passionnés',
    koins: 250,
    priceInCents: 599, // 5.99€ = ~0.024€ per Koin
    emoji: '💎'
  },
  {
    id: 'koins-500',
    name: 'Coffre au Trésor',
    description: '500 Koins pour les collectionneurs',
    koins: 500,
    priceInCents: 999, // 9.99€ = ~0.02€ per Koin
    emoji: '🏆'
  },
  {
    id: 'koins-1000',
    name: 'Coffre Légendaire',
    description: '1000 Koins + bonus exclusif',
    koins: 1000,
    priceInCents: 1699, // 16.99€ = ~0.017€ per Koin
    emoji: '👑'
  }
]

/**
 * Get a Koins package by ID
 *
 * @param id - Package identifier
 * @returns Package details or undefined if not found
 */
export function getKoinsPackage (id: string): KoinsPackage | undefined {
  return KOINS_PACKAGES.find(pkg => pkg.id === id)
}

/**
 * Format price in cents to displayable Euro string
 *
 * @param cents - Price in cents
 * @returns Formatted price string (e.g., "1,99€")
 */
export function formatPrice (cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(cents / 100)
}

/**
 * Calculate value per Koin for display
 *
 * @param koins - Number of Koins
 * @param priceInCents - Price in cents
 * @returns Value per Koin in cents
 */
export function getValuePerKoin (koins: number, priceInCents: number): number {
  return Math.round((priceInCents / koins) * 100) / 100
}
