/**
 * Quest Stats Card Component
 *
 * Displays quest completion statistics in a visually appealing card.
 * Shows total, completed, and claimed quest counts with percentages.
 *
 * Architecture:
 * - Single Responsibility: Statistics display only
 * - Pure presentational component
 * - Responsive design
 *
 * @module components/quests
 */

'use client'

import type { QuestStats } from '@/types/quest.types'

interface QuestStatsCardProps {
  stats: QuestStats
  period?: 'daily' | 'weekly' | 'all'
}

export default function QuestStatsCard ({
  stats,
  period = 'all'
}: QuestStatsCardProps): React.ReactNode {
  const periodLabel = {
    daily: 'Quotidiennes',
    weekly: 'Hebdomadaires',
    all: 'Toutes'
  }[period]

  return (
    <div className='bg-gradient-to-br from-autumn-cream via-white to-autumn-peach/20 rounded-2xl border-4 border-autumn-peach/40 p-6 shadow-lg mb-8'>
      <h3 className='text-xl font-bold text-chestnut-dark mb-4 flex items-center gap-2'>
        <span className='text-2xl'>📊</span>
        Statistiques - {periodLabel}
      </h3>

      <div className='grid grid-cols-3 gap-4'>
        {/* Total Quests */}
        <div className='text-center'>
          <div className='text-4xl font-bold text-autumn-cinnamon mb-1'>
            {stats.totalQuests}
          </div>
          <div className='text-sm text-chestnut-medium font-medium'>
            Quêtes totales
          </div>
        </div>

        {/* Completed */}
        <div className='text-center'>
          <div className='text-4xl font-bold text-blue-600 mb-1'>
            {stats.completedQuests}
          </div>
          <div className='text-sm text-chestnut-medium font-medium'>
            Complétées
          </div>
        </div>

        {/* Claimed */}
        <div className='text-center'>
          <div className='text-4xl font-bold text-green-600 mb-1'>
            {stats.claimedQuests}
          </div>
          <div className='text-sm text-chestnut-medium font-medium'>
            Réclamées
          </div>
        </div>
      </div>

      {/* Completion Percentage */}
      <div className='mt-6'>
        <div className='flex items-center justify-between text-sm mb-2'>
          <span className='font-medium text-chestnut-medium'>
            Taux de complétion
          </span>
          <span className='font-bold text-autumn-cinnamon'>
            {stats.completionPercentage}%
          </span>
        </div>
        <div className='w-full bg-autumn-cream rounded-full h-3 overflow-hidden border-2 border-autumn-peach/30'>
          <div
            className='h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500'
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
