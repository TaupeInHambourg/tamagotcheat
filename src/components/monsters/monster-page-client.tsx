'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { type Monster, parseMonsterTraits } from '@/types/monster.types'

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

interface MonsterPageProps {
  monster: Monster
}

function getMoodEmoji (state: string): string {
  const moodEmojis: Record<string, string> = {
    happy: '😄',
    sad: '😢',
    angry: '😤',
    hungry: '😋',
    sleepy: '😴'
  }
  return moodEmojis[state] ?? '😶'
}

function formatDate (date: string | undefined): string {
  if (typeof date !== 'string' || date.trim() === '') return 'Date inconnue'

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return 'Date inconnue'

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(parsedDate)
}

export default function MonsterPageClient ({ monster }: MonsterPageProps): React.ReactNode {
  const formattedCreationDate = useMemo(() => formatDate(monster.createdAt), [monster.createdAt])
  const moodEmoji = useMemo(() => getMoodEmoji(monster.state), [monster.state])
  const monsterTraits = useMemo(() => parseMonsterTraits(monster.traits), [monster.traits])

  return (
    <div className='w-full max-w-4xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-3xl shadow-md overflow-hidden'>
        {/* En-tête avec image */}
        <div className='relative h-64 sm:h-96 w-full bg-monsters-pink/5'>
          <Image
            src={monster.draw}
            alt={monster.name}
            fill
            className='object-contain'
            priority
          />
        </div>

        {/* Contenu */}
        <div className='p-6 sm:p-8'>
          <div className='flex flex-col gap-6'>
            {/* Titre et informations principales */}
            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>{monster.name}</h1>
                <p className='mt-1 text-sm text-slate-500'>
                  Créé le {formattedCreationDate}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-2xl' role='img' aria-label={`Humeur: ${monster.state}`}>
                  {moodEmoji}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStateStyle(monster.state)}`}>
                  {monster.state.charAt(0).toUpperCase() + monster.state.slice(1)}
                </span>
              </div>
            </div>

            {/* Niveau et caractéristiques */}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl bg-monsters-pink/5 p-4'>
                <p className='text-sm font-medium text-slate-900'>Niveau actuel</p>
                <p className='mt-1 text-2xl font-semibold text-pink-flare-600'>
                  {monster.level ?? 1}
                </p>
              </div>
              {monsterTraits !== null && (
                <div className='rounded-2xl bg-monsters-blue/5 p-4'>
                  <p className='text-sm font-medium text-slate-900'>Caractéristiques</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    <span className='inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200'>
                      {monsterTraits.bodyStyle}
                    </span>
                    <span className='inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200'>
                      {monsterTraits.eyeStyle}
                    </span>
                    {monsterTraits.antennaStyle !== 'none' && (
                      <span className='inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200'>
                        {monsterTraits.antennaStyle}
                      </span>
                    )}
                    {monsterTraits.accessory !== 'none' && (
                      <span className='inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200'>
                        {monsterTraits.accessory}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='flex flex-wrap gap-3 border-t border-slate-200 pt-6'>
              <button className='inline-flex items-center gap-2 rounded-full bg-monsters-pink/10 px-4 py-2 text-sm font-medium text-pink-flare-600 transition-colors hover:bg-monsters-pink/20'>
                🍪 Nourrir
              </button>
              <button className='inline-flex items-center gap-2 rounded-full bg-monsters-blue/10 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-monsters-blue/20'>
                💤 Mettre au lit
              </button>
              <button className='inline-flex items-center gap-2 rounded-full bg-monsters-green/10 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-monsters-green/20'>
                🎮 Jouer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
