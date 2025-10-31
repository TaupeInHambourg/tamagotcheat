/**
 * Level Progress Bar Component
 *
 * Displays a monster's current level and XP progression with a visual progress bar.
 * Uses TamagoTcheat autumn/cozy theme colors for visual consistency.
 *
 * Architecture:
 * - Presentational component (no business logic)
 * - Single Responsibility (displays level progression only)
 * - Reusable across different contexts
 *
 * Design principles:
 * - Uses autumn/cozy theme colors from globals.css
 * - Gradient matches the autumn palette (peach → coral → maple)
 * - Accessible with ARIA labels
 * - Cute emojis for playful touch (⭐, 🌟, 🏆)
 */

'use client'

import { getLevelProgress } from '@/utils/xp-system'

/**
 * Props for LevelProgressBar component
 */
interface LevelProgressBarProps {
  /** Current monster level */
  level: number
  /** Current XP within the level */
  currentXP: number
  /** Total XP required to reach next level */
  xpForNextLevel: number
  /** Additional CSS classes */
  className?: string
}

/**
 * LevelProgressBar component
 *
 * Displays level information with a colorful progress bar showing XP progress.
 *
 * @param level - Current level
 * @param currentXP - XP within current level
 * @param xpForNextLevel - XP needed for next level
 * @param className - Optional additional CSS classes
 *
 * @example
 * <LevelProgressBar
 *   level={5}
 *   currentXP={120}
 *   xpForNextLevel={500}
 * />
 */
export default function LevelProgressBar ({
  level,
  currentXP,
  xpForNextLevel,
  className = ''
}: LevelProgressBarProps): React.ReactNode {
  // Calculate progress percentage (0-100)
  const progress = getLevelProgress(currentXP, xpForNextLevel)

  // Check if max level reached
  const isMaxLevel = xpForNextLevel === 0

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Level Badge with autumn colors */}
      <div className='flex items-center gap-3 flex-wrap'>
        <div className='bg-gradient-to-r from-autumn-peach via-autumn-coral to-maple-warm text-white px-4 py-2 rounded-2xl shadow-cozy border-2 border-white hover-lift'>
          <span className='font-bold text-sm tracking-wider flex items-center gap-2'>
            <span className='text-base'>⭐</span>
            NIVEAU {level}
          </span>
        </div>

        {/* XP Text Display */}
        {!isMaxLevel && (
          <div className='text-sm text-chestnut-dark font-medium bg-autumn-cream px-3 py-1.5 rounded-full border border-chestnut-light'>
            <span className='font-bold text-autumn-cinnamon'>{currentXP}</span>
            <span className='text-chestnut-medium'> / </span>
            <span className='font-bold text-autumn-cinnamon'>{xpForNextLevel}</span>
            <span className='text-chestnut-medium'> XP</span>
          </div>
        )}
        {isMaxLevel && (
          <div className='text-sm text-white font-bold bg-gradient-to-r from-moss-medium to-moss-deep px-4 py-1.5 rounded-full shadow-cozy animate-pulse-soft'>
            <span className='flex items-center gap-1'>
              <span>🏆</span>
              NIVEAU MAX !
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar with autumn gradient */}
      <div className='w-full bg-chestnut-cream rounded-2xl h-4 overflow-hidden shadow-inner border-2 border-chestnut-light relative'>
        <div
          className='h-full bg-gradient-to-r from-autumn-peach via-autumn-coral to-maple-warm transition-all duration-500 ease-out shadow-lg relative overflow-hidden'
          style={{ width: `${progress}%` }}
          role='progressbar'
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression niveau ${level}: ${progress}%`}
        >
          {/* Animated shine effect */}
          <div
            className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent'
            style={{
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%'
            }}
          />
        </div>
      </div>

      {/* Progress Percentage with emoji */}
      {!isMaxLevel && (
        <div className='text-xs text-chestnut-medium text-right font-medium flex items-center justify-end gap-1'>
          <span className='text-base'>🌟</span>
          <span className='text-autumn-cinnamon font-bold'>{progress}%</span>
          <span>jusqu'au niveau {level + 1}</span>
        </div>
      )}
    </div>
  )
}
