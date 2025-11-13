/**
 * MonsterVisibilitySection Component
 *
 * Manages and displays monster's public visibility settings.
 * Extracted from MonsterPageClient for better separation of concerns.
 *
 * Architecture:
 * - Single Responsibility: Display and toggle visibility
 * - Dependency Inversion: Depends on callback abstraction
 *
 * @module components/monsters/MonsterVisibilitySection
 */

'use client'

import { memo } from 'react'
import Button from '@/components/Button'

interface MonsterVisibilitySectionProps {
  isPublic: boolean
  monsterName: string
  isUpdating: boolean
  onToggle: () => void
}

/**
 * MonsterVisibilitySection - Public gallery visibility control
 *
 * @param props - Component props
 * @returns React component
 */
function MonsterVisibilitySectionComponent ({
  isPublic,
  monsterName,
  isUpdating,
  onToggle
}: MonsterVisibilitySectionProps): React.ReactNode {
  return (
    <div className='flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200'>
      <div className='flex items-center gap-3'>
        <span className='text-2xl'>🌍</span>
        <div>
          <h3 className='text-sm font-semibold text-slate-900'>Galerie publique</h3>
          <p className='text-xs text-slate-500'>
            {isPublic
              ? 'Visible par tous les utilisateurs'
              : 'Seul toi peux voir cette créature'}
          </p>
        </div>
      </div>
      <Button
        variant={isPublic ? 'secondary' : 'primary'}
        size='sm'
        onClick={onToggle}
        disabled={isUpdating}
      >
        {isPublic ? '🔒 Rendre privé' : '🌍 Rendre public'}
      </Button>
    </div>
  )
}

// Memoize to prevent re-renders when parent updates
export const MonsterVisibilitySection = memo(MonsterVisibilitySectionComponent)
