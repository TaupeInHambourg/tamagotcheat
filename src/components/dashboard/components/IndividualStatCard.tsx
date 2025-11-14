/**
 * Individual Stat Card Component
 *
 * Displays a single statistic with an icon, label, value, and optional monster display.
 * Reusable component following Single Responsibility Principle.
 *
 * This component is a building block for the dashboard statistics section.
 */

import type { Monster } from '@/types/monster.types'
import { MonsterDisplay } from './MonsterDisplay'

interface IndividualStatCardProps {
  /** Icon emoji to display */
  icon: string
  /** Label describing the stat (can be string or JSX) */
  label: string | React.ReactNode
  /** Main value to highlight */
  value: string | number
  /** Optional secondary information */
  secondaryInfo?: string
  /** Optional monster to display */
  monster?: Monster | null
  /** Optional custom className */
  className?: string
}

/**
 * Individual statistic card with optional monster display
 *
 * @example
 * ```tsx
 * <IndividualStatCard
 *   icon="🏆"
 *   label="Niveau le plus élevé"
 *   value={5}
 *   monster={highestLevelMonster}
 * />
 * ```
 */
export function IndividualStatCard ({
  icon,
  label,
  value,
  secondaryInfo,
  monster,
  className = ''
}: IndividualStatCardProps): React.ReactNode {
  return (
    <div
      className={`group rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-autumn-cream p-4 sm:p-6 shadow-md ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-lg hover:ring-autumn-coral/40 active:scale-[0.98] touch-manipulation ${className}`}
    >
      {/* Header with integrated value in title */}
      <div className='mb-4 sm:mb-6'>
        <h3 className='flex flex-wrap items-baseline gap-1.5 sm:gap-2 text-base sm:text-lg font-bold text-chestnut-dark leading-snug'>
          <span>{label}</span>
        </h3>
      </div>

      {/* Monster display if provided */}
      {monster !== undefined && monster !== null && (
        <div className='pt-1 sm:pt-2'>
          <MonsterDisplay monster={monster} size='lg' secondaryInfo={secondaryInfo} />
        </div>
      )}
    </div>
  )
}
