/**
 * RarityBadge Component
 *
 * Displays a subtle badge for accessory rarity.
 * Matches the clean badge style used throughout the app.
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { getRarityConfig } from '@/config/accessories.config'
import type { Rarity } from '@/types/accessory.types'

interface RarityBadgeProps {
  /** The rarity level to display */
  rarity: Rarity
  /** Size variant of the badge */
  size?: 'sm' | 'md' | 'lg'
  /** Whether to show the rarity name text */
  showName?: boolean
}

function getSizeClasses (size: 'sm' | 'md' | 'lg'): string {
  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }
  return sizeMap[size]
}

export default function RarityBadge ({
  rarity,
  size = 'md',
  showName = true
}: RarityBadgeProps): ReactNode {
  const config = getRarityConfig(rarity)
  const sizeClasses = getSizeClasses(size)

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-full font-semibold
        bg-gradient-to-r ${config.color}
        text-white shadow-sm
        ${sizeClasses}
        transition-all duration-300
        hover:scale-105
      `}
    >
      <span className='text-xs'>{config.emoji}</span>
      {showName && <span>{config.name}</span>}
    </span>
  )
}
