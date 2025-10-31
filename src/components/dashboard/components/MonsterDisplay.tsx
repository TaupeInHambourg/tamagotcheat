/**
 * Monster Display Component for Stats Cards
 *
 * Displays a monster's visual and name in a compact, elegant format.
 * Designed for use within dashboard statistics cards.
 * Clickable to navigate to the monster's detail page.
 *
 * Following Clean Architecture:
 * - Single Responsibility: Only displays monster visual + name
 * - Reusable across different stat cards
 * - No business logic, pure presentation
 */

import Image from 'next/image'
import Link from 'next/link'
import type { Monster } from '@/types/monster.types'
import { getMonsterAssetPath, extractFolderPath } from '@/utils/monster-asset-resolver'

interface MonsterDisplayProps {
  /** The monster to display */
  monster: Monster
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Optional secondary information to display below the name */
  secondaryInfo?: string
  /** Optional custom className */
  className?: string
}

/**
 * Size configurations for the monster image
 */
const SIZE_CONFIG = {
  sm: { width: 64, height: 64, textSize: 'text-sm', padding: 3, gap: 'gap-3' },
  md: { width: 96, height: 96, textSize: 'text-base', padding: 4, gap: 'gap-4' },
  lg: { width: 120, height: 120, textSize: 'text-lg', padding: 4, gap: 'gap-4' }
} as const

/**
 * Displays a monster's visual representation and name
 * Clickable link to navigate to the monster's detail page
 *
 * @example
 * ```tsx
 * <MonsterDisplay monster={highestLevelMonster} size="md" secondaryInfo="250 XP total" />
 * ```
 */
export function MonsterDisplay ({ monster, size = 'md', secondaryInfo, className = '' }: MonsterDisplayProps): React.ReactNode {
  const config = SIZE_CONFIG[size]
  const folderPath = extractFolderPath(monster.draw)
  const assetPath = getMonsterAssetPath(folderPath, monster.state)
  const monsterId = monster._id ?? monster.id

  return (
    <Link
      href={`/creatures/${monsterId}`}
      className={`group/monster flex items-center ${config.gap} ${className} rounded-2xl transition-all duration-300 hover:bg-autumn-peach/20 p-3 -m-3 cursor-pointer`}
    >
      <div
        className='relative flex-shrink-0 rounded-2xl bg-gradient-to-br from-autumn-cream to-autumn-peach shadow-sm ring-1 ring-autumn-coral/20 transition-transform duration-300 group-hover/monster:scale-105 group-hover/monster:shadow-md'
        style={{ width: config.width + (config.padding * 8), height: config.height + (config.padding * 8), padding: `${config.padding * 4}px` }}
      >
        <Image
          src={assetPath}
          alt={monster.name}
          width={config.width}
          height={config.height}
          className='object-contain'
          unoptimized
        />
      </div>
      <div className='flex-1 min-w-0'>
        <p className={`font-bold text-chestnut-dark truncate transition-colors duration-300 group-hover/monster:text-pink-flare-600 ${config.textSize}`}>
          {monster.name}
        </p>
        {secondaryInfo !== undefined && secondaryInfo !== '' && (
          <p className='mt-1 text-sm text-slate-600 transition-colors duration-300 group-hover/monster:text-slate-700'>
            {secondaryInfo}
          </p>
        )}
      </div>
    </Link>
  )
}
