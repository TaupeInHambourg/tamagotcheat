/**
 * Quests Page Client Component
 *
 * Interactive quests display with:
 * - Tab switching between daily and weekly quests
 * - Real-time quest progress
 * - Reward claiming with toast notifications
 * - Statistics display
 *
 * Architecture:
 * - Client Component for interactivity
 * - State management for UI updates
 * - Optimistic UI updates
 *
 * @module app/quests
 */

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import type { Quest } from '@/types/quest.types'
import type { QuestPeriod } from '@/config/quests.config'
import { getQuests, claimQuestReward, getQuestStats } from '@/actions/quests.actions'
import QuestCard from '@/components/quests/QuestCard'
import QuestTabs from '@/components/quests/QuestTabs'
import QuestStatsCard from '@/components/quests/QuestStatsCard'

export default function QuestsContent (): React.ReactNode {
  const [activeTab, setActiveTab] = useState<QuestPeriod>('daily')
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalQuests: 0,
    completedQuests: 0,
    claimedQuests: 0,
    completionPercentage: 0
  })

  // Load quests for the active tab
  const loadQuests = async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await getQuests(activeTab)
      setQuests(data)

      // Load stats
      const statsData = await getQuestStats(activeTab)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading quests:', error)
      toast.error('Erreur lors du chargement des quêtes')
    } finally {
      setLoading(false)
    }
  }

  // Reload quests when tab changes
  useEffect(() => {
    void loadQuests()
  }, [activeTab])

  // Auto-refresh quests every 10 seconds to detect completions
  useEffect(() => {
    const interval = setInterval(() => {
      void loadQuests()
    }, 10000)

    return () => { clearInterval(interval) }
  }, [activeTab])

  // Handle quest reward claim
  const handleClaim = async (questId: string): Promise<void> => {
    setClaimingId(questId)

    try {
      const result = await claimQuestReward(questId)

      if (result.success) {
        // Show success toast
        const quest = quests.find(q => q.id === questId)
        if (quest != null) {
          const rewardText = quest.rewardType === 'koins'
            ? `+${quest.rewardAmount} Koins`
            : `+${quest.rewardAmount} Cadeau${quest.rewardAmount > 1 ? 'x' : ''}`

          toast.success(`🎉 Récompense réclamée ! ${rewardText}`, {
            autoClose: 3000
          })
        }

        // Reload quests
        await loadQuests()
      } else {
        toast.error(result.error ?? 'Erreur lors de la réclamation')
      }
    } catch (error) {
      console.error('Error claiming quest:', error)
      toast.error('Erreur lors de la réclamation')
    } finally {
      setClaimingId(null)
    }
  }

  const dailyQuests = quests.filter(q => q.period === 'daily')
  const weeklyQuests = quests.filter(q => q.period === 'weekly')
  const displayQuests = activeTab === 'daily' ? dailyQuests : weeklyQuests

  if (loading && quests.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-autumn-cream via-white to-autumn-peach/20 p-4 sm:p-6 lg:p-8'>
        <div className='max-w-4xl mx-auto py-12'>
          <div className='text-center'>
            <div className='text-6xl mb-4 animate-bounce'>⏳</div>
            <p className='text-chestnut-medium text-lg'>Chargement des quêtes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-autumn-cream via-white to-autumn-peach/20 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-4xl mx-auto py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-autumn-terracotta to-maple-warm rounded-full mb-4 shadow-lg'>
            <span className='text-4xl'>🏆</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent mb-2'>
            Quêtes & Récompenses
          </h1>
          <p className='text-chestnut-medium text-lg'>
            Complète les missions pour gagner des Koins et des cadeaux !
          </p>
        </div>

        {/* Stats Card */}
        <QuestStatsCard stats={stats} period={activeTab} />

        {/* Tabs */}
        <QuestTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          dailyCount={dailyQuests.length}
          weeklyCount={weeklyQuests.length}
        />

        {/* Quests List */}
        <div className='space-y-4'>
          {displayQuests.length === 0
            ? (
              <div className='bg-white rounded-2xl border-4 border-autumn-peach/30 p-12 text-center shadow-lg'>
                <div className='text-6xl mb-4'>✨</div>
                <p className='text-chestnut-medium text-lg'>
                  Aucune quête disponible pour le moment
                </p>
              </div>
              )
            : (
                displayQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onClaim={(id) => { void handleClaim(id) }}
                    isClaiming={claimingId === quest.id}
                  />
                ))
              )}
        </div>

        {/* Info */}
        <div className='mt-8 text-center text-sm text-chestnut-medium'>
          <p>
            {activeTab === 'daily'
              ? '📅 Les quêtes quotidiennes se renouvellent toutes les heures (test)'
              : '📆 Les quêtes hebdomadaires se renouvellent toutes les 2 heures (test)'}
          </p>
          <p className='mt-2 text-xs opacity-75'>
            En production: quotidiennes = 24h, hebdomadaires = 7 jours
          </p>
        </div>
      </div>
    </div>
  )
}
