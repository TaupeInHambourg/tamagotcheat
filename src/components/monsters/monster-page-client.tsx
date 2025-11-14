'use client'

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { toast, Bounce } from 'react-toastify'
import { type Monster } from '@/types/monster.types'
import { useMonsterPolling } from '@/hooks/use-monster-polling'
import { useMonsterSize } from '@/hooks/use-monster-size'
import { useConfetti } from '@/hooks/use-confetti'
import { interactWithMonster, updateMonsterVisibility, giveGiftToMonsterAction, playWithMonsterAction, getRemainingPlays } from '@/actions/monsters.actions'
import { getUserGiftsBalance } from '@/actions/quests.actions'
import Button from '@/components/Button'
import { extractFolderPath, getMonsterAssetPath } from '@/utils/monster-asset-resolver'
import { MonsterWithAccessories } from './MonsterWithAccessories'
import { MonsterHeader } from './MonsterHeader'
import { MonsterActions } from './MonsterActions'
import { MonsterVisibilitySection } from './MonsterVisibilitySection'
import { AccessoryPanel } from '../accessories'
import { BackgroundPanel } from '../backgrounds'
import LevelProgressBar from './LevelProgressBar'
import { calculateLevelFromXP } from '@/utils/xp-system'
import {
  formatDate,
  getMoodEmoji,
  getStateLabelFr,
  getMonsterId,
  TOAST_SUCCESS_CONFIG,
  TOAST_INFO_CONFIG,
  TOAST_ERROR_CONFIG
} from '@/utils/monster-page.utils'

interface MonsterPageProps {
  monster: Monster
}

export default function MonsterPageClient ({ monster: initialMonster }: MonsterPageProps): React.ReactNode {
  const [isInteracting, setIsInteracting] = useState(false)
  const [accessoryRefreshTrigger, setAccessoryRefreshTrigger] = useState(0)
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)
  const [giftsBalance, setGiftsBalance] = useState(0)
  const [isGivingGift, setIsGivingGift] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [remainingPlays, setRemainingPlays] = useState(3)

  // Use custom hooks
  const monsterSize = useMonsterSize()
  const { celebrateLevelUp } = useConfetti()

  // Track previous level to detect level-ups
  const previousLevelRef = useRef<number>(initialMonster.level ?? 1)

  // Load gifts balance and remaining plays
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const balance = await getUserGiftsBalance()
      setGiftsBalance(balance)

      const monsterId = getMonsterId(initialMonster)
      const plays = await getRemainingPlays(monsterId)
      setRemainingPlays(plays)
    }

    void loadData()
  }, [initialMonster])

  /**
   * Callback to refresh monster accessories display
   */
  const refreshAccessories = useCallback((): void => {
    setAccessoryRefreshTrigger(prev => prev + 1)
  }, [])

  /**
   * Handles monster interaction with action buttons
   */
  const handleInteraction = useCallback(async (action: string, actionLabel: string) => {
    if (isInteracting) return

    setIsInteracting(true)

    try {
      const monsterId = getMonsterId(initialMonster)
      const result = await interactWithMonster(monsterId, action)

      if (result.success) {
        toast.success(
          `✨ ${actionLabel} a fonctionné ! ${initialMonster.name} est maintenant heureux ! 😄`,
          { ...TOAST_SUCCESS_CONFIG, transition: Bounce }
        )
      }
    } catch (error) {
      console.error('Error during interaction:', error)
      toast.error('Une erreur est survenue lors de l\'interaction', TOAST_ERROR_CONFIG)
    } finally {
      setIsInteracting(false)
    }
  }, [initialMonster, isInteracting])

  /**
   * Use simplified polling hook with lazy state computation on backend
   */
  const { monster } = useMonsterPolling({
    initialMonster,
    onStateChange: useCallback((newState: string, oldState: string) => {
      console.log(`🎉 ${initialMonster.name} changed state: ${oldState} → ${newState}`)

      const oldEmoji = getMoodEmoji(oldState)
      const newEmoji = getMoodEmoji(newState)
      const newLabel = getStateLabelFr(newState)

      toast.info(
        `${newEmoji} ${initialMonster.name} est maintenant ${newLabel.toLowerCase()} ! (${oldEmoji} → ${newEmoji})`,
        { ...TOAST_INFO_CONFIG, transition: Bounce }
      )
    }, [initialMonster.name]),
    pollingInterval: 2000,
    enabled: true,
    verbose: false
  })

  // Memoize computed values
  const formattedCreationDate = useMemo(() => formatDate(monster.createdAt), [monster.createdAt])
  const moodEmoji = useMemo(() => getMoodEmoji(monster.state), [monster.state])
  const folderPath = useMemo(() => extractFolderPath(monster.draw), [monster.draw])
  const currentAsset = useMemo(() => getMonsterAssetPath(folderPath, monster.state), [folderPath, monster.state])
  const monsterId = useMemo(() => getMonsterId(monster), [monster])

  // Detect level-up and trigger confetti celebration
  useEffect(() => {
    const currentLevel = monster.level ?? 1
    const previousLevel = previousLevelRef.current

    if (currentLevel > previousLevel) {
      // Level up detected!
      console.log(`🎉 Level up! ${previousLevel} → ${currentLevel}`)

      // Trigger confetti animation
      celebrateLevelUp()

      // Show toast notification
      toast.success(
        `🎊 Félicitations ! ${monster.name} a atteint le niveau ${currentLevel} ! 🎊`,
        {
          ...TOAST_SUCCESS_CONFIG,
          transition: Bounce,
          autoClose: 4000
        }
      )
    }

    // Update the ref for next comparison
    previousLevelRef.current = currentLevel
  }, [monster.level, monster.name, celebrateLevelUp])

  /**
   * Handles toggling the public visibility of the monster
   */
  const handleToggleVisibility = useCallback(async () => {
    if (isUpdatingVisibility) return

    setIsUpdatingVisibility(true)

    try {
      const newIsPublic = !(monster.isPublic ?? false)
      const result = await updateMonsterVisibility(monsterId, newIsPublic)

      if (result.success) {
        toast.success(
          newIsPublic
            ? `🌍 ${monster.name} est maintenant visible dans la galerie publique !`
            : `🔒 ${monster.name} est maintenant privé`,
          { ...TOAST_SUCCESS_CONFIG, transition: Bounce }
        )
      } else {
        toast.error('Une erreur est survenue lors de la mise à jour de la visibilité', TOAST_ERROR_CONFIG)
      }
    } catch (error) {
      console.error('Error updating visibility:', error)
      toast.error('Une erreur est survenue lors de la mise à jour de la visibilité', TOAST_ERROR_CONFIG)
    } finally {
      setIsUpdatingVisibility(false)
    }
  }, [monster, monsterId, isUpdatingVisibility])

  /**
   * Handles giving a gift to the monster
   */
  const handleGiveGift = useCallback(async () => {
    if (isGivingGift || giftsBalance === 0) return

    setIsGivingGift(true)

    try {
      const result = await giveGiftToMonsterAction(monsterId)

      if (result.success) {
        toast.success(
          `🎁 Tu as offert un cadeau à ${monster.name} ! +${result.xpGained ?? 50} XP !`,
          { ...TOAST_SUCCESS_CONFIG, transition: Bounce }
        )
        setGiftsBalance(prev => Math.max(0, prev - 1))
      } else {
        toast.error(result.error ?? 'Impossible d\'offrir le cadeau', TOAST_ERROR_CONFIG)
      }
    } catch (error) {
      console.error('Error giving gift:', error)
      toast.error('Une erreur est survenue lors de l\'offrande du cadeau', TOAST_ERROR_CONFIG)
    } finally {
      setIsGivingGift(false)
    }
  }, [monster.name, monsterId, isGivingGift, giftsBalance])

  /**
   * Handles playing with the monster (daily limited action)
   */
  const handlePlay = useCallback(async () => {
    if (isPlaying || remainingPlays === 0) return

    setIsPlaying(true)

    try {
      const result = await playWithMonsterAction(monsterId)

      if (result.success) {
        toast.success(
          `🎮 Tu as joué avec ${monster.name} ! +${result.xpGained ?? 15} XP ! (${result.remainingPlays ?? 0}/3 restants)`,
          { ...TOAST_SUCCESS_CONFIG, transition: Bounce }
        )
        setRemainingPlays(result.remainingPlays ?? 0)
      } else {
        toast.error(result.error ?? 'Impossible de jouer avec la créature', TOAST_ERROR_CONFIG)
      }
    } catch (error) {
      console.error('Error playing with monster:', error)
      toast.error('Une erreur est survenue lors du jeu', TOAST_ERROR_CONFIG)
    } finally {
      setIsPlaying(false)
    }
  }, [monster.name, monsterId, isPlaying, remainingPlays])

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
        <div className='relative h-64 sm:h-80 md:h-96 lg:h-[28rem] w-full bg-monsters-pink/5 flex items-center justify-center overflow-hidden'>
          <div className='w-full h-full'>
            <MonsterWithAccessories
              monsterId={monsterId}
              imageSrc={currentAsset}
              state={monster.state}
              size={monsterSize}
              refreshTrigger={accessoryRefreshTrigger}
            />
          </div>
        </div>

        {/* Contenu */}
        <div className='p-6 sm:p-8'>
          <div className='flex flex-col gap-6'>
            {/* Titre et informations principales */}
            <MonsterHeader
              name={monster.name}
              creationDate={formattedCreationDate}
              state={monster.state}
              moodEmoji={moodEmoji}
            />

            {/* Niveau et caractéristiques */}
            <div className='grid gap-4'>
              <LevelProgressBar
                level={monster.level ?? 1}
                currentXP={monster.experience ?? 0}
                xpForNextLevel={calculateLevelFromXP(monster.totalExperience ?? 0).xpForNextLevel}
              />
            </div>

            {/* Visibilité publique */}
            <MonsterVisibilitySection
              isPublic={monster.isPublic ?? false}
              monsterName={monster.name}
              isUpdating={isUpdatingVisibility}
              onToggle={() => { void handleToggleVisibility() }}
            />

            {/* Actions */}
            <MonsterActions
              isInteracting={isInteracting}
              isGivingGift={isGivingGift}
              giftsBalance={giftsBalance}
              isPlaying={isPlaying}
              remainingPlays={remainingPlays}
              onInteraction={(action, label) => { void handleInteraction(action, label) }}
              onGiveGift={() => { void handleGiveGift() }}
              onPlay={() => { void handlePlay() }}
            />

            {/* Accessory Management Panel */}
            <div className='border-t border-slate-200 pt-6'>
              <AccessoryPanel
                monsterId={monsterId}
                onAccessoriesChange={refreshAccessories}
              />
            </div>

            {/* Background Management Panel */}
            <div className='border-t border-slate-200 pt-6'>
              <BackgroundPanel
                monsterId={monsterId}
                onBackgroundChange={refreshAccessories}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
