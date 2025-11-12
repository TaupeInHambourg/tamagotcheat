/**
 * Quest Tabs Component
 *
 * Tab switcher for daily and weekly quests.
 * Displays active tab with autumn-themed styling.
 *
 * Architecture:
 * - Single Responsibility: Tab navigation only
 * - Controlled component pattern
 * - Accessible with keyboard navigation
 *
 * @module components/quests
 */

'use client'

import type { QuestPeriod } from '@/config/quests.config'

interface QuestTabsProps {
  activeTab: QuestPeriod
  onTabChange: (tab: QuestPeriod) => void
  dailyCount?: number
  weeklyCount?: number
}

export default function QuestTabs ({
  activeTab,
  onTabChange,
  dailyCount = 0,
  weeklyCount = 0
}: QuestTabsProps): React.ReactNode {
  return (
    <div className='flex gap-2 p-2 bg-autumn-cream rounded-2xl border-2 border-autumn-peach/30 mb-8'>
      <button
        onClick={() => { onTabChange('daily') }}
        className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
          activeTab === 'daily'
            ? 'bg-gradient-to-r from-autumn-terracotta to-maple-warm text-white shadow-lg scale-105'
            : 'text-chestnut-medium hover:text-chestnut-dark hover:bg-white/50'
        }`}
      >
        <div className='flex items-center justify-center gap-2'>
          <span className='text-2xl'>📅</span>
          <span>Quotidiennes</span>
          {dailyCount > 0 && (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeTab === 'daily'
                  ? 'bg-white/20'
                  : 'bg-autumn-peach/30'
              }`}
            >
              {dailyCount}
            </span>
          )}
        </div>
      </button>

      <button
        onClick={() => { onTabChange('weekly') }}
        className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
          activeTab === 'weekly'
            ? 'bg-gradient-to-r from-autumn-cinnamon to-autumn-terracotta text-white shadow-lg scale-105'
            : 'text-chestnut-medium hover:text-chestnut-dark hover:bg-white/50'
        }`}
      >
        <div className='flex items-center justify-center gap-2'>
          <span className='text-2xl'>📆</span>
          <span>Hebdomadaires</span>
          {weeklyCount > 0 && (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeTab === 'weekly'
                  ? 'bg-white/20'
                  : 'bg-autumn-peach/30'
              }`}
            >
              {weeklyCount}
            </span>
          )}
        </div>
      </button>
    </div>
  )
}
