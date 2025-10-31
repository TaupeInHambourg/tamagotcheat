'use client'

import { useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast, Bounce } from 'react-toastify'
import { type Monster } from '@/types/monster.types'
import { useMonsterPolling } from '@/hooks/use-monster-polling'
import { interactWithMonster, updateMonsterVisibility } from '@/actions/monsters.actions'
import Button from '../Button'
import { extractFolderPath, getMonsterAssetPath } from '@/utils/monster-asset-resolver'
import { MonsterWithAccessories } from './MonsterWithAccessories'
import { AccessoryPanel } from '../accessories'
import LevelProgressBar from './LevelProgressBar'
import { calculateLevelFromXP } from '@/utils/xp-system'

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

/**
 * Safely extracts the monster ID from either id or _id field
 * The repository should always provide an id field, but we keep _id as fallback
 * @param monster - Monster object
 * @returns The monster ID as string
 */
function getMonsterId (monster: Monster): string {
  // Repository normalizes _id to id, so id should always be available
  // We keep _id as fallback for backward compatibility
  return monster.id ?? monster._id ?? ''
}

export default function MonsterPageClient ({ monster: initialMonster }: MonsterPageProps): React.ReactNode {
  const [isInteracting, setIsInteracting] = useState(false)
  const [accessoryRefreshTrigger, setAccessoryRefreshTrigger] = useState(0)
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)

  /**
   * Callback to refresh monster accessories display
   * Increments trigger to force MonsterWithAccessories to re-fetch
   */
  const refreshAccessories = (): void => {
    setAccessoryRefreshTrigger(prev => prev + 1)
  }

  /**
   * Handles monster interaction with action buttons
   *
   * Business logic (enforced by backend):
   * - hungry → feed
   * - sleepy → sleep
   * - sad → play
   * - angry → cuddle
   * - happy → no action needed
   *
   * If wrong action is clicked, nothing happens (backend returns error silently).
   * If correct action is clicked, monster becomes happy.
   */
  const handleInteraction = useCallback(async (action: string, actionLabel: string) => {
    if (isInteracting) return

    setIsInteracting(true)

    try {
      const monsterId = getMonsterId(initialMonster)
      const result = await interactWithMonster(monsterId, action)

      if (result.success) {
        // Success: Show success toast
        toast.success(
          `✨ ${actionLabel} a fonctionné ! ${initialMonster.name} est maintenant heureux ! 😄`,
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
            transition: Bounce
          }
        )
      } else {
        // Wrong action or already happy: Silent fail (no toast)
        // The backend has already validated and rejected the action
        console.log(`Action ${action} n'est pas applicable pour l'état actuel`)
      }
    } catch (error) {
      console.error('Error during interaction:', error)
      toast.error(
        'Une erreur est survenue lors de l\'interaction',
        {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light'
        }
      )
    } finally {
      setIsInteracting(false)
    }
  }, [initialMonster, isInteracting])

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

  // Get the correct folder path and asset for the monster
  const folderPath = useMemo(() => extractFolderPath(monster.draw), [monster.draw])
  const currentAsset = useMemo(() => getMonsterAssetPath(folderPath, monster.state), [folderPath, monster.state])

  /**
   * Handles toggling the public visibility of the monster
   */
  const handleToggleVisibility = useCallback(async () => {
    if (isUpdatingVisibility) return

    setIsUpdatingVisibility(true)

    try {
      const monsterId = getMonsterId(monster)
      const newIsPublic = !(monster.isPublic ?? false)
      const result = await updateMonsterVisibility(monsterId, newIsPublic)

      if (result.success) {
        toast.success(
          newIsPublic
            ? `🌍 ${monster.name} est maintenant visible dans la galerie publique !`
            : `🔒 ${monster.name} est maintenant privé`,
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
            transition: Bounce
          }
        )
      } else {
        toast.error(
          'Une erreur est survenue lors de la mise à jour de la visibilité',
          {
            position: 'top-right',
            autoClose: 3000,
            theme: 'light'
          }
        )
      }
    } catch (error) {
      console.error('Error updating visibility:', error)
      toast.error(
        'Une erreur est survenue lors de la mise à jour de la visibilité',
        {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light'
        }
      )
    } finally {
      setIsUpdatingVisibility(false)
    }
  }, [monster, isUpdatingVisibility])

  return (
    <div className='w-full max-w-4xl mx-auto px-4 py-8'>
      {/* Bouton boutique en haut */}
      <div className='mb-6 flex justify-end'>
        <Link href='/shop'>
          <Button variant='primary' size='md'>
            <span className='flex items-center gap-2'>
              <span>🛍️</span>
              <span>Boutique</span>
            </span>
          </Button>
        </Link>
      </div>

      <div className='bg-white rounded-3xl shadow-md overflow-hidden'>
        {/* En-tête avec créature et accessoires */}
        <div className='relative h-64 sm:h-96 w-full bg-monsters-pink/5 flex items-center justify-center'>
          <MonsterWithAccessories
            monsterId={getMonsterId(monster)}
            imageSrc={currentAsset}
            state={monster.state}
            size={400}
            refreshTrigger={accessoryRefreshTrigger}
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
            <div className='grid gap-4'>
              {/* Barre de progression XP */}
              <LevelProgressBar
                level={monster.level ?? 1}
                currentXP={monster.experience ?? 0}
                xpForNextLevel={calculateLevelFromXP(monster.totalExperience ?? 0).xpForNextLevel}
              />
            </div>

            {/* Visibilité publique */}
            <div className='flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200'>
              <div className='flex items-center gap-3'>
                <span className='text-2xl'>🌍</span>
                <div>
                  <h3 className='text-sm font-semibold text-slate-900'>Galerie publique</h3>
                  <p className='text-xs text-slate-500'>
                    {monster.isPublic === true
                      ? 'Visible par tous les utilisateurs'
                      : 'Seul toi peux voir cette créature'}
                  </p>
                </div>
              </div>
              <Button
                variant={monster.isPublic === true ? 'secondary' : 'primary'}
                size='sm'
                onClick={() => { void handleToggleVisibility() }}
                disabled={isUpdatingVisibility}
              >
                {monster.isPublic === true ? '🔒 Rendre privé' : '🌍 Rendre public'}
              </Button>
            </div>

            {/* Actions */}
            <div className='flex flex-wrap gap-3 border-t border-slate-200 pt-6 justify-center'>
              <Button
                variant='outline'
                onClick={() => { void handleInteraction('feed', 'Nourrir') }}
                disabled={isInteracting}
              >
                🍪 Nourrir
              </Button>
              <Button
                variant='outline'
                onClick={() => { void handleInteraction('sleep', 'Mettre au lit') }}
                disabled={isInteracting}
              >
                💤 Mettre au lit
              </Button>
              <Button
                variant='outline'
                onClick={() => { void handleInteraction('play', 'Jouer') }}
                disabled={isInteracting}
              >
                🎮 Jouer
              </Button>
              <Button
                variant='outline'
                onClick={() => { void handleInteraction('cuddle', 'Câliner') }}
                disabled={isInteracting}
              >
                💕 Câliner
              </Button>
            </div>

            {/* Accessory Management Panel */}
            <div className='border-t border-slate-200 pt-6'>
              <AccessoryPanel
                monsterId={getMonsterId(monster)}
                onAccessoriesChange={refreshAccessories}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
