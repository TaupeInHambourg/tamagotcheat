/**
 * MonsterHeader Component
 *
 * Displays monster name, creation date, and current mood/state.
 * Extracted from MonsterPageClient for better separation of concerns.
 *
 * Architecture:
 * - Single Responsibility: Display monster header info
 * - Pure Component: No side effects, only display logic
 *
 * @module components/monsters/MonsterHeader
 */

'use client'

import { memo } from 'react'
import { getStateStyle, getStateLabelFr } from '@/utils/monster-page.utils'

interface MonsterHeaderProps {
  name: string
  creationDate: string
  state: string
  moodEmoji: string
}

/**
 * MonsterHeader - Displays monster identification and mood
 *
 * @param props - Component props
 * @returns React component
 */
function MonsterHeaderComponent ({
  name,
  creationDate,
  state,
  moodEmoji
}: MonsterHeaderProps): React.ReactNode {
  return (
    <div className='flex items-start justify-between'>
      <div>
        <h1 className='text-3xl font-bold text-slate-900'>{name}</h1>
        <p className='mt-1 text-sm text-slate-500'>
          Créé le {creationDate}
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-2xl' role='img' aria-label={`Humeur: ${state}`}>
          {moodEmoji}
        </span>
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full transition-all duration-500 ${getStateStyle(state)}`}>
          {getStateLabelFr(state)}
        </span>
      </div>
    </div>
  )
}

// Memoize to prevent re-renders when parent updates
export const MonsterHeader = memo(MonsterHeaderComponent)
