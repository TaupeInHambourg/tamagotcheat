/**
 * MonsterCard Component
 *
 * Unified monster card component with invisible auto-refresh capability.
 * Used for both dashboard and public gallery displays.
 *
 * Features:
 * - Auto-refresh every 3 seconds (configurable)
 * - Display equipped accessories
 * - Optional owner name display
 * - Invisible refresh (no loading animation)
 * - Smooth state transitions
 * - Responsive styling
 *
 * Design Principle:
 * - Silent operation: Auto-refresh happens in background without visual feedback
 * - Clean UX: No loading spinners or animations during refresh
 * - Real-time updates: Monster state updates automatically reflect server changes
 */

'use client'

import { type Monster, type MonsterState, DEFAULT_MONSTER_STATE, MONSTER_STATES } from '@/types/monster.types'
import { useMonsterPolling } from '@/hooks/use-monster-polling'
import { getMonsterAssetPath, extractFolderPath } from '@/utils/monster-asset-resolver'
import { MonsterWithAccessories } from './MonsterWithAccessories'
import Link from 'next/link'

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

const STATE_BADGE_CLASSES: Record<MonsterState, string> = {
  happy: 'bg-lochinvar-100 text-lochinvar-700 ring-1 ring-inset ring-lochinvar-200',
  sad: 'bg-fuchsia-blue-100 text-fuchsia-blue-700 ring-1 ring-inset ring-fuchsia-blue-200',
  angry: 'bg-moccaccino-100 text-moccaccino-600 ring-1 ring-inset ring-moccaccino-200',
  hungry: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200',
  sleepy: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
}

const MONSTER_STATE_EMOJI: Record<MonsterState, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😤',
  hungry: '😋',
  sleepy: '😴'
}

const isMonsterState = (value: MonsterState | string | null | undefined): value is MonsterState => (
  typeof value === 'string' && MONSTER_STATES.includes(value as MonsterState)
)

const formatAdoptionDate = (value: string | undefined): string | null => {
  if (value === undefined) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

export interface MonsterCardProps {
  initialMonster: Monster & { ownerName?: string }
  autoRefresh?: boolean
  showOwner?: boolean
  isClickable?: boolean
}

export function MonsterCard ({
  initialMonster,
  autoRefresh = true,
  showOwner = false,
  isClickable = true
}: MonsterCardProps): React.ReactNode {
  /**
   * Use simplified polling hook for cards
   *
   * Card-specific configuration:
   * - Polls every 3 seconds for real-time updates
   * - Disabled polling optional for performance (set autoRefresh={false})
   * - Silent operation (no logs) for clean card experience
   *
   * Integration with lazy state system:
   * - Each poll triggers backend state computation
   * - Backend updates database if state changed
   * - Card automatically reflects new state
   * - No manual state management needed
   */
  const { monster } = useMonsterPolling({
    initialMonster,
    pollingInterval: 3000, // Poll every 3 seconds
    enabled: autoRefresh,
    verbose: false
  })

  const state = isMonsterState(monster.state) ? monster.state : DEFAULT_MONSTER_STATE
  const adoptionDate = formatAdoptionDate(monster.createdAt ?? monster.updatedAt)
  const levelLabel = monster.level ?? 1
  const monsterId = String(monster.id ?? monster._id ?? '')
  const monsterHref = `/creatures/${monsterId}`
  const ownerName = (initialMonster as Monster & { ownerName?: string }).ownerName

  // Get the correct asset path based on current state
  const folderPath = extractFolderPath(monster.draw)
  const currentAsset = getMonsterAssetPath(folderPath, state)

  const cardContent = (
    <article className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-autumn-coral/50'>
      <div className='relative flex flex-col gap-4 sm:gap-6'>
        {/* Monster visual with accessories */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-2xl bg-autumn-cream/50 p-4 sm:p-6 border border-autumn-peach/30'>
          {/* Refresh is now invisible - no animation during auto-refresh */}
          <div className='w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] flex items-center justify-center'>
            <MonsterWithAccessories
              monsterId={monsterId}
              imageSrc={currentAsset}
              state={state}
              size={200}
              refreshTrigger={0}
            />
          </div>
          <span
            className='absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex items-center gap-1 sm:gap-2 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-all duration-500 text-autumn-brown'
          >
            <span aria-hidden='true'>⭐</span>
            Niv {levelLabel}
          </span>
          {monster.isPublic === true && (
            <span
              className='absolute left-2 top-2 sm:left-3 sm:top-3 inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold bg-lochinvar-500 shadow-md'
              title='Visible dans la galerie publique'
            >
              <span aria-hidden='true'>🌍</span>
              Public
            </span>
          )}
        </div>

        <div className='flex flex-1 flex-col gap-3 sm:gap-4'>
          <div className='flex items-start justify-between gap-2 sm:gap-3'>
            <div className='space-y-1 sm:space-y-2 flex-1'>
              <h3 className='text-lg sm:text-xl font-bold text-chestnut-deep'>{monster.name}</h3>
              {!showOwner && adoptionDate !== null && (
                <p className='text-xs sm:text-sm text-chestnut-medium'>Arrivé le {adoptionDate}</p>
              )}
              {showOwner && ownerName !== undefined && ownerName !== '' && (
                <p className='text-xs sm:text-sm text-chestnut-medium flex items-center gap-1.5'>
                  <span aria-hidden='true'>👤</span>
                  Par {ownerName}
                </p>
              )}
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full ${STATE_BADGE_CLASSES[state]} px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-autumn-brown`}>
              <span aria-hidden='true' className='hidden sm:inline'>{MONSTER_STATE_EMOJI[state]}</span>
              <span className='sm:hidden'>{MONSTER_STATE_EMOJI[state]}</span>
              <span className='hidden sm:inline'>{MONSTER_STATE_LABELS[state]}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  )

  if (!isClickable) {
    return cardContent
  }

  return (
    <Link href={monsterHref} className='block group'>
      {cardContent}
    </Link>
  )
}
