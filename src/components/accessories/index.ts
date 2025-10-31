/**
 * Accessories Module Exports
 *
 * Centralized exports for the accessories system.
 * Simplifies imports throughout the application.
 *
 * @example
 * ```typescript
 * // Instead of multiple imports:
 * import { AccessoryPreview } from '@/components/accessories/AccessoryPreview'
 * import { AccessorySlot } from '@/components/accessories/AccessorySlot'
 *
 * // Use barrel import:
 * import { AccessoryPreview, AccessorySlot } from '@/components/accessories'
 * ```
 */

// UI Components
export { AccessoryPreview } from './AccessoryPreview'
export { AccessorySlot } from './AccessorySlot'
export { AccessorySelector } from './AccessorySelector'
export { AccessoryPanel } from './AccessoryPanel'

// Re-export existing components for convenience
export { default as AccessoryCard } from './AccessoryCard'
export { default as RarityBadge } from './RarityBadge'
