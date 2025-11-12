/**
 * Quest Card Component
 *
 * Displays a single quest with:
 * - Quest icon, title, and description
 * - Progress bar
 * - Reward information
 * - Claim button when completed
 *
 * Architecture:
 * - Single Responsibility: Quest display only
 * - Props interface for clean API
 * - Accessible UI with proper semantics
 *
 * @module components/quests
 */

'use client'

import type { Quest } from '@/types/quest.types'
import { getQuestDefinition } from '@/config/quests.config'
import Button from '@/components/Button'

interface QuestCardProps {
  quest: Quest
  onClaim: (questId: string) => void
  isClaiming: boolean
}

export default function QuestCard ({ quest, onClaim, isClaiming }: QuestCardProps): React.ReactNode {
  const definition = getQuestDefinition(quest.questType, quest.period)

  if (definition == null) return null

  const progress = Math.min((quest.currentCount / quest.targetCount) * 100, 100)
  const isCompleted = quest.completed
  const isClaimed = quest.claimed

  return (
    <div className='bg-white rounded-2xl border-4 border-autumn-peach/30 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300'>
      <div className='flex items-start gap-4'>
        {/* Icon */}
        <div className='text-5xl flex-shrink-0 animate-bounce'>
          {definition.icon}
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2 mb-3'>
            <div>
              <h3 className='font-bold text-xl text-chestnut-dark mb-1'>
                {definition.title}
              </h3>
              <p className='text-sm text-chestnut-medium'>
                {definition.description}
              </p>
            </div>
            {isClaimed && (
              <div className='flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0'>
                ✓ Réclamé
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className='mb-4'>
            <div className='flex items-center justify-between text-sm mb-2'>
              <span className='text-chestnut-medium font-medium'>
                Progression: {quest.currentCount}/{quest.targetCount}
              </span>
              <span className='font-bold text-autumn-cinnamon'>
                {Math.round(progress)}%
              </span>
            </div>
            <div className='w-full bg-autumn-cream rounded-full h-3 overflow-hidden border-2 border-autumn-peach/30'>
              <div
                className='h-full bg-gradient-to-r from-autumn-terracotta to-maple-warm transition-all duration-500 ease-out'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Reward and Action */}
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>
                {quest.rewardType === 'koins' ? '💰' : '🎁'}
              </span>
              <div className='text-sm'>
                <div className='font-semibold text-chestnut-dark'>
                  Récompense
                </div>
                <div className='font-bold text-autumn-cinnamon'>
                  {definition.rewardDescription}
                </div>
              </div>
            </div>

            {isCompleted && !isClaimed && (
              <Button
                onClick={() => { onClaim(quest.id) }}
                disabled={isClaiming}
                size='md'
                variant='primary'
              >
                {isClaiming ? 'Réclamation...' : 'Réclamer 🎉'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
