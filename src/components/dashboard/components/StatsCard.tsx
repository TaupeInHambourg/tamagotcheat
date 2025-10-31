/**
 * Stats Card Component
 *
 * Displays key statistics about user's monsters with visual representations.
 * Enhanced to show featured monsters prominently.
 *
 * Following Clean Architecture principles:
 * - Uses utility functions for business logic (dashboard-stats.ts)
 * - Delegates rendering to specialized components (IndividualStatCard, MonsterDisplay)
 * - Focuses only on composition and data orchestration
 */

import { useMemo } from 'react'
import { type Monster } from '@/types/monster.types'
import {
  findHighestLevelMonster,
  findLatestAdoptedMonster,
  formatAdoptionDate
} from '@/utils/dashboard-stats'
import { IndividualStatCard } from './IndividualStatCard'

interface StatsCardProps {
  monsters: Monster[]
}

export function StatsCard ({ monsters }: StatsCardProps): React.ReactNode {
  // Calculate statistics using pure utility functions
  const highestLevelData = useMemo(() => findHighestLevelMonster(monsters), [monsters])
  const latestAdoptedData = useMemo(() => findLatestAdoptedMonster(monsters), [monsters])
  const totalMonsters = monsters.length

  // Format adoption date for display
  const adoptionDateText = useMemo(() => {
    if (latestAdoptedData === null) {
      return 'Aucune adoption'
    }
    return formatAdoptionDate(latestAdoptedData.adoptedAt)
  }, [latestAdoptedData])

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
      {/* Highest Level Card */}
      <IndividualStatCard
        icon='⭐'
        label={
          <>
            Vous avez atteint le niveau{' '}
            <span className='mx-2 text-3xl font-black text-pink-flare-600 transition-colors duration-300 group-hover:text-pink-flare-700'>
              {highestLevelData?.level ?? 1}
            </span>{' '}
            ⭐
          </>
        }
        value={highestLevelData?.level ?? 1}
        secondaryInfo={
          highestLevelData !== null
            ? `${highestLevelData.monster.totalExperience ?? highestLevelData.monster.experience ?? 0} XP total`
            : 'Pas encore de créature'
        }
        monster={highestLevelData?.monster}
      />

      {/* Total Monsters Card */}
      <IndividualStatCard
        icon='🐾'
        label={
          <>
            Vous avez adopté{' '}
            <span className='mx-2 text-3xl font-black text-pink-flare-600 transition-colors duration-300 group-hover:text-pink-flare-700'>
              {totalMonsters}
            </span>{' '}
            {totalMonsters > 1 ? 'compagnons' : 'compagnon'} 🐾
          </>
        }
        value={totalMonsters}
        secondaryInfo={
          latestAdoptedData !== null
            ? `Dernière adoption: ${adoptionDateText}`
            : 'Crée ta première créature !'
        }
        monster={latestAdoptedData?.monster}
      />
    </div>
  )
}
