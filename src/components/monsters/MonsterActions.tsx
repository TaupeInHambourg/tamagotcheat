/**
 * MonsterActions Component
 *
 * Displays action buttons for monster interactions.
 * Extracted from MonsterPageClient for better separation of concerns.
 *
 * Architecture:
 * - Single Responsibility: Display and handle monster interaction buttons
 * - Dependency Inversion: Depends on callback abstraction
 *
 * @module components/monsters/MonsterActions
 */

'use client'

import { memo } from 'react'
import Button from '@/components/Button'

interface MonsterActionsProps {
  isInteracting: boolean
  isGivingGift: boolean
  giftsBalance: number
  isPlaying: boolean
  remainingPlays: number
  onInteraction: (action: string, label: string) => void
  onGiveGift: () => void
  onPlay: () => void
}

/**
 * Action button configuration
 */
const INTERACTION_BUTTONS = [
  { action: 'feed', label: 'Nourrir', emoji: '🍪' },
  { action: 'sleep', label: 'Mettre au lit', emoji: '💤' },
  { action: 'play', label: 'Consoler', emoji: '🤗' },
  { action: 'cuddle', label: 'Écouter', emoji: '👂' }
] as const

/**
 * MonsterActions - Interaction buttons for monster care
 *
 * @param props - Component props
 * @returns React component
 */
function MonsterActionsComponent ({
  isInteracting,
  isGivingGift,
  giftsBalance,
  isPlaying,
  remainingPlays,
  onInteraction,
  onGiveGift,
  onPlay
}: MonsterActionsProps): React.ReactNode {
  return (
    <div className='flex flex-wrap gap-3 border-t border-slate-200 pt-6 justify-center'>
      {INTERACTION_BUTTONS.map(({ action, label, emoji }) => (
        <Button
          key={action}
          variant='outline'
          onClick={() => { onInteraction(action, label) }}
          disabled={isInteracting}
        >
          {emoji} {label}
        </Button>
      ))}
      <Button
        variant='secondary'
        onClick={onPlay}
        disabled={isPlaying || remainingPlays === 0}
      >
        {isPlaying
          ? '🎮 En cours...'
          : `🎮 Jouer (${remainingPlays}/3)`}
      </Button>
      <Button
        variant='primary'
        onClick={onGiveGift}
        disabled={isGivingGift || giftsBalance === 0}
      >
        {isGivingGift
          ? '🎁 En cours...'
          : `🎁 Cadeau (${giftsBalance})`}
      </Button>
    </div>
  )
}

// Memoize to prevent re-renders when parent updates
export const MonsterActions = memo(MonsterActionsComponent)
