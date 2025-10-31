/**
 * Monster Components Index
 *
 * Central export point for all monster-related components.
 */

// Canvas-based rendering with accessories support
export { PixelMonster } from './PixelMonster'
export { MonsterWithAccessories } from './MonsterWithAccessories'

// Card component (unified for dashboard and gallery)
export { MonsterCard } from './monster-card'

// List and detail components
export { default as MonstersList } from './monsters-list'
export { default as MonsterPageClient } from './monster-page-client'

// Types
export type { MonsterCardProps } from './monster-card'
export type { DashboardMonster } from './monsters-list'
