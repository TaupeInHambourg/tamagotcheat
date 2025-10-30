'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type Monster } from '@/types/monster.types'
import { useMonsterPolling } from '@/hooks/use-monster-polling'

export interface MonsterCardProps {
  monster: Monster
  className?: string
  /** Enable auto-refresh for this card (default: true) */
  autoRefresh?: boolean
}

function getStateStyle (state: string): string {
  switch (state) {
    case 'happy':
      return 'bg-green-100 text-green-800'
    case 'angry':
      return 'bg-red-100 text-red-800'
    case 'sleepy':
      return 'bg-blue-100 text-blue-800'
    case 'hungry':
      return 'bg-yellow-100 text-yellow-800'
    case 'sad':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function MonsterCard ({ monster: initialMonster, className = '', autoRefresh = true }: MonsterCardProps): React.ReactNode {
  // Use simplified polling hook
  const { monster } = useMonsterPolling({
    initialMonster,
    pollingInterval: 3000, // Poll every 3 seconds for cards
    enabled: autoRefresh,
    verbose: false
  })

  const stateStyle = getStateStyle(monster.state)
  const displayName = monster.name.length > 20 ? `${monster.name.slice(0, 20)}...` : monster.name
  const monsterId = monster.id ?? monster._id ?? ''

  return (
    <Link
      href={`/creatures/${monsterId}`}
      className={`group block bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className='relative w-full h-48'>
        <div className='absolute inset-0 bg-monsters-pink/5 transition-colors duration-300 group-hover:bg-monsters-pink/10' />
        <Image
          src={monster.draw}
          alt={displayName}
          fill
          className='object-contain transition-transform duration-500 group-hover:scale-105'
        />
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-semibold text-pink-flare-900 transition-colors duration-300 group-hover:text-pink-flare-700'>
          {displayName}
        </h3>
        <p className='text-sm text-slate-600'>Niveau {monster.level ?? 1}</p>
        <div className='mt-2'>
          <span className={`inline-block px-2 py-1 rounded-full text-xs transition-all duration-500 ${stateStyle} group-hover:shadow-sm`}>
            {monster.state.charAt(0).toUpperCase() + monster.state.slice(1)}
          </span>
        </div>
      </div>
    </Link>
  )
}
