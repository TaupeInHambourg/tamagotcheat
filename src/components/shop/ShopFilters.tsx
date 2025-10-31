/**
 * ShopFilters Component
 *
 * UI controls for filtering and sorting shop accessories.
 * Implements Single Responsibility Principle - only handles filter UI.
 *
 * @component
 */

import type { ReactNode } from 'react'
import type { SortOrder } from '@/utils/shop-filters'

interface ShopFiltersProps {
  /** Current sort order */
  sortOrder: SortOrder
  /** Whether owned items are hidden */
  hideOwned: boolean
  /** Callback when sort order changes */
  onSortChange: (order: SortOrder) => void
  /** Callback when hide owned toggle changes */
  onHideOwnedChange: (hide: boolean) => void
  /** Number of owned items (for display) */
  ownedCount: number
}

/**
 * ShopFilters - Filter and sort controls for shop
 *
 * Provides UI controls for:
 * - Sorting by rarity (rarest first / common first)
 * - Hiding/showing owned items
 *
 * Design Principles:
 * - Single Responsibility: Only handles filter UI
 * - Open/Closed: Can add new filters without modifying existing ones
 * - Dependency Inversion: Depends on callback abstractions
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <ShopFilters
 *   sortOrder="rarest-first"
 *   hideOwned={false}
 *   onSortChange={setSortOrder}
 *   onHideOwnedChange={setHideOwned}
 *   ownedCount={5}
 * />
 * ```
 */
export default function ShopFilters ({
  sortOrder,
  hideOwned,
  onSortChange,
  onHideOwnedChange,
  ownedCount
}: ShopFiltersProps): ReactNode {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* Sort Order Toggle */}
      <button
        onClick={() => {
          onSortChange(sortOrder === 'rarest-first' ? 'common-first' : 'rarest-first')
        }}
        className='
          px-4 py-2 rounded-lg
          font-medium text-sm
          transition-all duration-300
          flex items-center gap-2
          bg-white text-chestnut-deep
          ring-1 ring-chestnut-light
          hover:ring-2 hover:ring-autumn-coral hover:shadow-md
          hover:-translate-y-0.5
        '
        title='Changer l&apos;ordre de tri'
      >
        <span className='text-base'>
          {sortOrder === 'rarest-first' ? '⬇️' : '⬆️'}
        </span>
        <span>
          {sortOrder === 'rarest-first' ? 'Plus rares en premier' : 'Moins rares en premier'}
        </span>
      </button>

      {/* Hide Owned Toggle */}
      <button
        onClick={() => {
          onHideOwnedChange(!hideOwned)
        }}
        className={`
          px-4 py-2 rounded-lg
          font-medium text-sm
          transition-all duration-300
          flex items-center gap-2
          hover:-translate-y-0.5
          ${hideOwned
            ? 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white shadow-md ring-2 ring-autumn-cinnamon/30'
            : 'bg-white text-chestnut-deep ring-1 ring-chestnut-light hover:ring-2 hover:ring-autumn-coral hover:shadow-md'
          }
        `}
        title={hideOwned ? 'Afficher les items possédés' : 'Cacher les items possédés'}
      >
        <span className='text-base'>
          {hideOwned ? '👁️' : '👁️‍🗨️'}
        </span>
        <span>
          {hideOwned ? 'Items possédés cachés' : 'Afficher tous les items'}
        </span>
        {ownedCount > 0 && (
          <span
            className={`
              px-2 py-0.5 rounded-full text-xs font-bold
              ${hideOwned
                ? 'bg-white/20 text-white'
                : 'bg-autumn-coral/10 text-autumn-coral'
              }
            `}
          >
            {ownedCount}
          </span>
        )}
      </button>
    </div>
  )
}
