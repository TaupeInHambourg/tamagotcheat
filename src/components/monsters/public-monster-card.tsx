/**
 * PublicMonsterCard Component
 *
 * Card component for displaying monsters in the public gallery.
 * Shows monster visual with accessories, name, level, and owner name.
 *
 * Features:
 * - Read-only display (no interactions)
 * - Shows owner information
 * - Displays accessories
 * - Clean, gallery-focused design
 */

'use client'

import { type Monster, type MonsterState, DEFAULT_MONSTER_STATE, MONSTER_STATES } from '@/types/monster.types'
import { getMonsterAssetPath, extractFolderPath } from '@/utils/monster-asset-resolver'
import { MonsterWithAccessories } from './MonsterWithAccessories'

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
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

interface PublicMonsterCardProps {
  monster: Monster & { ownerName?: string }
}

export function PublicMonsterCard ({ monster }: PublicMonsterCardProps): React.ReactNode {
  const state = isMonsterState(monster.state) ? monster.state : DEFAULT_MONSTER_STATE
  const levelLabel = monster.level ?? 1
  const monsterId = monster.id ?? monster._id ?? ''

  // Get the correct asset path based on current state
  const folderPath = extractFolderPath(monster.draw)
  const currentAsset = getMonsterAssetPath(folderPath, state)

  return (
    <article className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-autumn-coral/50'>
      <div className='relative flex flex-col gap-6'>
        {/* Monster visual with accessories */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-2xl bg-autumn-cream/50 p-6 border border-autumn-peach/30'>
          <div className='w-[200px] h-[200px] flex items-center justify-center'>
            <MonsterWithAccessories
              monsterId={monsterId}
              imageSrc={currentAsset}
              state={state}
              size={200}
              refreshTrigger={0}
            />
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-4'>
          {/* Monster info */}
          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-2 flex-1'>
              <h3 className='text-xl font-bold text-chestnut-deep'>{monster.name}</h3>
              {monster.ownerName !== undefined && monster.ownerName !== '' && (
                <p className='text-sm text-chestnut-medium flex items-center gap-1.5'>
                  <span aria-hidden='true'>👤</span>
                  Par {monster.ownerName}
                </p>
              )}
            </div>
            <span className='inline-flex items-center gap-1 rounded-full bg-autumn-peach px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-autumn-brown'>
              <span aria-hidden='true'>⭐</span>
              Niv {levelLabel}
            </span>
          </div>

          {/* Tags */}
          <div className='flex flex-wrap gap-2 text-xs'>
            <span className='inline-flex items-center gap-1 rounded-full bg-moss-pastel px-3 py-1.5 font-semibold text-moss-deep'>
              <span aria-hidden='true'>🎨</span>
              Pixel art
            </span>
            <span className='inline-flex items-center gap-1 rounded-full bg-maple-light px-3 py-1.5 font-semibold text-maple-deep transition-all duration-500'>
              <span aria-hidden='true'>{MONSTER_STATE_EMOJI[state]}</span>
              {MONSTER_STATE_LABELS[state]}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
