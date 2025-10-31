/**
 * Monster Components Index
 *
 * Central export point for all monster-related components.
 */

// Canvas-based rendering with accessories support
export { PixelMonster } from './PixelMonster'
export { MonsterWithAccessories } from './MonsterWithAccessories'

// Existing components
export { default as MonsterCard } from './monster-card'
export { default as MonstersList } from './monsters-list'
export { default as MonsterPageClient } from './monster-page-client'
export { MonsterDashboardCard } from './monster-dashboard-card'

// Types
export type { MonsterCardProps } from './monster-card'
export type { DashboardMonster } from './monsters-list'
