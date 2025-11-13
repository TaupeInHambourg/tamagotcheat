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

// Sub-components (refactored from monster-page-client)
export { MonsterHeader } from './MonsterHeader'
export { MonsterActions } from './MonsterActions'
export { MonsterVisibilitySection } from './MonsterVisibilitySection'
export { default as LevelProgressBar } from './LevelProgressBar'

// Types
export type { MonsterCardProps } from './monster-card'
export type { DashboardMonster } from './monsters-list'
