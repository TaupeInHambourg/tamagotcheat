/**
 * Dashboard Quests Section Component
 *
 * Displays a preview of daily quests on the dashboard.
 * Shows up to 3 quests with a link to the full quests page.
 *
 * Architecture:
 * - Single Responsibility: Dashboard quest preview only
 * - Client component for interactivity
 * - Auto-refreshes quest data
 *
 * @module components/dashboard
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import type { Quest } from '@/types/quest.types'
import { getQuests, claimQuestReward } from '@/actions/quests.actions'
import { getQuestDefinition, DASHBOARD_QUEST_PREVIEW_COUNT } from '@/config/quests.config'
import Button from '../Button'

export default function QuestsSection (): React.ReactNode {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const loadQuests = async (): Promise<void> => {
    try {
      const dailyQuests = await getQuests('daily')
      setQuests(dailyQuests.slice(0, DASHBOARD_QUEST_PREVIEW_COUNT))
    } catch (error) {
      console.error('Error loading quests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadQuests()

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      void loadQuests()
    }, 10000)

    return () => { clearInterval(interval) }
  }, [])

  const handleClaim = async (questId: string): Promise<void> => {
    setClaimingId(questId)

    try {
      const result = await claimQuestReward(questId)

      if (result.success) {
        const quest = quests.find(q => q.id === questId)
        if (quest != null) {
          const rewardText = quest.rewardType === 'koins'
            ? `+${quest.rewardAmount} Koins`
            : `+${quest.rewardAmount} Cadeau${quest.rewardAmount > 1 ? 'x' : ''}`

          toast.success(`🎉 Récompense réclamée ! ${rewardText}`)
        }

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

  if (loading) {
    return (
      <div className='card-cozy p-6'>
        <div className='text-center'>
          <div className='text-4xl mb-2 animate-bounce'>⏳</div>
          <p className='text-sm text-chestnut-medium'>Chargement des quêtes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='card-cozy p-6 sm:p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='text-4xl'>🏆</div>
          <div>
            <h2 className='text-2xl font-bold text-chestnut-dark'>
              Quêtes Quotidiennes
            </h2>
            <p className='text-sm text-chestnut-medium'>
              Complète les missions pour gagner des récompenses
            </p>
          </div>
        </div>
        <Link href='/quests'>
          <Button variant='outline' size='sm'>
            Voir tout
          </Button>
        </Link>
      </div>

      {/* Quests List */}
      <div className='space-y-4'>
        {quests.length === 0
          ? (
            <div className='text-center py-8'>
              <div className='text-5xl mb-3'>✨</div>
              <p className='text-chestnut-medium'>
                Aucune quête disponible pour le moment
              </p>
            </div>
            )
          : (
              quests.map((quest) => {
                const definition = getQuestDefinition(quest.questType, quest.period)
                if (definition == null) return null

                const progress = Math.min((quest.currentCount / quest.targetCount) * 100, 100)
                const isCompleted = quest.completed
                const isClaimed = quest.claimed

                return (
                  <div
                    key={quest.id}
                    className='bg-autumn-cream/50 rounded-xl p-4 border-2 border-autumn-peach/30 hover:border-autumn-peach/60 transition-all duration-200'
                  >
                    <div className='flex items-start gap-3'>
                      {/* Icon */}
                      <div className='text-3xl flex-shrink-0'>
                        {definition.icon}
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2 mb-2'>
                          <div>
                            <h3 className='font-bold text-base text-chestnut-dark'>
                              {definition.title}
                            </h3>
                            <p className='text-xs text-chestnut-medium'>
                              {definition.description}
                            </p>
                          </div>
                          {isClaimed && (
                            <div className='text-green-600 text-xs font-bold'>
                              ✓
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className='mb-3'>
                          <div className='flex items-center justify-between text-xs mb-1'>
                            <span className='text-chestnut-medium'>
                              {quest.currentCount}/{quest.targetCount}
                            </span>
                            <span className='font-bold text-autumn-cinnamon'>
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className='w-full bg-white rounded-full h-2 overflow-hidden'>
                            <div
                              className='h-full bg-gradient-to-r from-autumn-terracotta to-maple-warm transition-all duration-500'
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Reward and Action */}
                        <div className='flex items-center justify-between'>
                          <div className='text-xs'>
                            <span className='font-semibold text-chestnut-dark'>
                              Récompense:{' '}
                            </span>
                            <span className='font-bold text-autumn-cinnamon'>
                              {definition.rewardDescription}
                            </span>
                          </div>

                          {isCompleted && !isClaimed && (
                            <Button
                              onClick={() => { void handleClaim(quest.id) }}
                              disabled={claimingId === quest.id}
                              size='sm'
                              variant='primary'
                            >
                              {claimingId === quest.id ? '...' : 'Réclamer'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
      </div>

      {/* Footer */}
      {quests.length > 0 && (
        <div className='mt-6 text-center'>
          <Link href='/quests'>
            <Button variant='primary' size='md'>
              <span className='flex items-center gap-2'>
                <span>Voir toutes les quêtes</span>
                <span>🏆</span>
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
