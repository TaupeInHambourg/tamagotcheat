/**
 * Monster Components Index
 *
 * Central export point for all monster-related components.
 */

// Canvas-based rendering with accessories support
export { PixelMonster } from './PixelMonster'
export { MonsterWithAccessories } from './MonsterWithAccessories'

// Card components
export { MonsterCard } from './monster-card'
export { PublicMonsterCard } from './public-monster-card'

// List and detail components
export { default as MonstersList } from './monsters-list'
export { default as MonsterPageClient } from './monster-page-client'

// Types
export type { MonsterCardProps } from './monster-card'
export type { DashboardMonster } from './monsters-list'
