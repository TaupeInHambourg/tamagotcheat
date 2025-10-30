'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { toast, Bounce } from 'react-toastify'
import { type Monster } from '@/types/monster.types'
import { useMonsterPolling } from '@/hooks/use-monster-polling'
import Button from '../Button'
import { getMonsterAssetPath, extractFolderPath } from '@/utils/monster-asset-resolver'

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

function getStateLabelFr (state: string): string {
  const stateLabels: Record<string, string> = {
    happy: 'Heureux',
    sad: 'Triste',
    angry: 'En colère',
    hungry: 'Affamé',
    sleepy: 'Endormi'
  }
  return stateLabels[state] ?? state.charAt(0).toUpperCase() + state.slice(1)
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

export default function MonsterPageClient ({ monster: initialMonster }: MonsterPageProps): React.ReactNode {
  /**
   * Use simplified polling hook with lazy state computation on backend
   *
   * How it works:
   * 1. Hook polls /api/monsters/[id] every 2 seconds
   * 2. Backend (getMonsterById) applies lazy state computation
   * 3. If state changed, backend updates database automatically
   * 4. Hook detects state change and triggers notification
   *
   * Benefits:
   * - State computed only when monster is viewed
   * - Backend handles all state logic (single responsibility)
   * - Frontend just polls and displays (separation of concerns)
   */
  const { monster } = useMonsterPolling({
    initialMonster,
    onStateChange: (newState, oldState) => {
      console.log(`🎉 ${initialMonster.name} changed state: ${oldState} → ${newState}`)

      // Show toast notification with custom styling
      const oldEmoji = getMoodEmoji(oldState)
      const newEmoji = getMoodEmoji(newState)
      const newLabel = getStateLabelFr(newState)

      toast.info(
        `${newEmoji} ${initialMonster.name} est maintenant ${newLabel.toLowerCase()} ! (${oldEmoji} → ${newEmoji})`,
        {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce
        }
      )
    },
    pollingInterval: 2000, // Poll every 2 seconds
    enabled: true,
    verbose: false // Set to true for debugging
  })

  const formattedCreationDate = useMemo(() => formatDate(monster.createdAt), [monster.createdAt])
  const moodEmoji = useMemo(() => getMoodEmoji(monster.state), [monster.state])

  // Get the correct asset path based on current state
  const folderPath = useMemo(() => extractFolderPath(monster.draw), [monster.draw])
  const currentAsset = useMemo(() => getMonsterAssetPath(folderPath, monster.state), [folderPath, monster.state])

  return (
    <div className='w-full max-w-4xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-3xl shadow-md overflow-hidden'>
        {/* En-tête avec image */}
        <div className='relative h-64 sm:h-96 w-full bg-monsters-pink/5'>
          <Image
            src={currentAsset}
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
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full transition-all duration-500 ${getStateStyle(monster.state)}`}>
                  {getStateLabelFr(monster.state)}
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
            </div>

            {/* Actions */}
            <div className='flex flex-wrap gap-3 border-t border-slate-200 pt-6 justify-center'>
              <Button variant='outline'>
                🍪 Nourrir
              </Button>
              <Button variant='outline'>
                💤 Mettre au lit
              </Button>
              <Button variant='outline'>
                🎮 Jouer
              </Button>
              <Button variant='outline'>
                💕 Câliner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
