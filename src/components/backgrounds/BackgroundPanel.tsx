/**
 * BackgroundPanel Component
 *
 * Complete panel for managing a monster's background.
 * Shows the current background with equip/unequip functionality.
 *
 * Architecture:
 * - Client component (interactive panel)
 * - Single Responsibility: Orchestrate background management UI
 * - Dependency Inversion: Depends on actions interface, not implementation
 *
 * @module components/backgrounds
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getMyBackgrounds, getCreatureBackground, equipBackground, unequipBackground } from '@/actions/backgrounds.actions'
import { BACKGROUNDS_CATALOG } from '@/config/backgrounds.config'
import type { BackgroundDB, Background } from '@/types/background.types'

interface BackgroundPanelProps {
  /** Monster ID to manage background for */
  monsterId: string
  /** Callback when background changes (for parent refresh) */
  onBackgroundChange?: () => void
}

/**
 * BackgroundPanel - Complete background management interface
 *
 * This component provides a full-featured UI for:
 * - Viewing equipped background
 * - Equipping new backgrounds from owned collection
 * - Unequipping background
 * - Visual feedback during operations
 *
 * Design Principles:
 * - Single Responsibility: Only manages background UI interactions
 * - Dependency Inversion: Depends on actions abstractions
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <BackgroundPanel
 *   monsterId="monster_123"
 *   onBackgroundChange={() => refreshMonster()}
 * />
 * ```
 */
export function BackgroundPanel ({
  monsterId,
  onBackgroundChange
}: BackgroundPanelProps): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<BackgroundDB[]>([])
  const [equippedBackground, setEquippedBackground] = useState<BackgroundDB | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOperating, setIsOperating] = useState(false)

  /**
   * Fetch backgrounds on mount and when monsterId changes
   */
  useEffect(() => {
    const fetchBackgrounds = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const [owned, equipped] = await Promise.all([
          getMyBackgrounds(),
          getCreatureBackground(monsterId)
        ])
        setOwnedBackgrounds(owned)
        setEquippedBackground(equipped)
      } catch (error) {
        console.error('Failed to fetch backgrounds:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchBackgrounds()
  }, [monsterId])

  /**
   * Handle equipping a background
   */
  const handleEquip = (backgroundDbId: string): void => {
    void (async () => {
      try {
        setIsOperating(true)
        const result = await equipBackground(backgroundDbId, monsterId)

        if (result.success) {
          // Refresh background
          const newEquipped = await getCreatureBackground(monsterId)
          setEquippedBackground(newEquipped)
          setIsOpen(false)
          onBackgroundChange?.()
        } else {
          console.error('Failed to equip background:', result.error)
          alert(`❌ ${result.error ?? 'Erreur lors de l\'équipement'}`)
        }
      } catch (error) {
        console.error('Error equipping background:', error)
        alert('❌ Une erreur est survenue')
      } finally {
        setIsOperating(false)
      }
    })()
  }

  /**
   * Handle unequipping the current background
   */
  const handleUnequip = (): void => {
    if (equippedBackground == null) return

    void (async () => {
      try {
        setIsOperating(true)
        const result = await unequipBackground(equippedBackground._id)

        if (result.success) {
          setEquippedBackground(null)
          onBackgroundChange?.()
        } else {
          console.error('Failed to unequip background:', result.error)
          alert(`❌ ${result.error ?? 'Erreur lors du retrait'}`)
        }
      } catch (error) {
        console.error('Error unequipping background:', error)
        alert('❌ Une erreur est survenue')
      } finally {
        setIsOperating(false)
      }
    })()
  }

  /**
   * Get background info from catalog
   */
  const getBackgroundInfo = (backgroundId: string): Background | undefined => {
    return BACKGROUNDS_CATALOG.find(bg => bg.id === backgroundId)
  }

  if (isLoading) {
    return (
      <div className='rounded-2xl bg-gradient-to-br from-pastel-sky to-pastel-lavender/30 p-6 shadow-md border-2 border-pastel-lavender/30'>
        <div className='text-center py-8'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-chestnut-dark shadow-sm'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-monster-purple border-t-transparent' />
            <span>Chargement des backgrounds...</span>
          </div>
        </div>
      </div>
    )
  }

  const equippedInfo = equippedBackground != null
    ? getBackgroundInfo(equippedBackground.backgroundId)
    : null

  return (
    <div className='rounded-2xl bg-gradient-to-br from-pastel-sky to-pastel-lavender/30 p-6 shadow-md border-2 border-pastel-lavender/30'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-3'>
        <span className='text-3xl'>🖼️</span>
        <div>
          <h3 className='text-xl font-bold text-chestnut-deep'>
            Background
          </h3>
          <p className='text-sm text-chestnut-dark'>
            Personnalisez l'arrière-plan de votre créature
          </p>
        </div>
      </div>

      {/* Current Background Display */}
      <div className='mb-4'>
        {equippedBackground != null && equippedInfo != null
          ? (
            <div className='relative group'>
              {/* Background Preview */}
              <div className='relative w-full aspect-square rounded-xl overflow-hidden shadow-inner border-2 border-pastel-lavender/50'>
                <Image
                  src={equippedInfo.assetPath}
                  alt={equippedInfo.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 400px'
                />
              </div>

              {/* Info Overlay */}
              <div className='mt-3 flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-chestnut-deep'>
                    {equippedInfo.name}
                  </p>
                  <p className='text-xs text-chestnut-medium'>
                    {equippedInfo.description}
                  </p>
                </div>
                <button
                  onClick={handleUnequip}
                  disabled={isOperating}
                  className='px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-maple-warm to-maple-deep rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isOperating ? '⏳' : '✖️'} Retirer
                </button>
              </div>
            </div>
            )
          : (
            <div className='w-full aspect-square rounded-xl bg-white/50 border-2 border-dashed border-pastel-lavender/50 flex items-center justify-center'>
              <div className='text-center'>
                <span className='text-4xl mb-2 block'>🖼️</span>
                <p className='text-sm text-chestnut-medium'>Aucun background équipé</p>
              </div>
            </div>
            )}
      </div>

      {/* Equip Button */}
      <button
        onClick={() => { setIsOpen(true) }}
        disabled={isOperating || ownedBackgrounds.length === 0}
        className='w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-monster-purple to-pastel-lavender rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
      >
        {ownedBackgrounds.length === 0
          ? (
            <>
              <span>🛍️</span>
              <span>Acheter des backgrounds</span>
            </>
            )
          : (
            <>
              <span>🎨</span>
              <span>Choisir un background ({ownedBackgrounds.length})</span>
            </>
            )}
      </button>

      {/* Background Selector Modal */}
      {isOpen && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
            {/* Modal Header */}
            <div className='sticky top-0 bg-gradient-to-r from-monster-purple to-pastel-lavender p-6 border-b border-pastel-lavender/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-2xl font-bold text-white flex items-center gap-2'>
                    <span>🖼️</span>
                    <span>Choisir un background</span>
                  </h3>
                  <p className='text-sm text-white/80 mt-1'>
                    {ownedBackgrounds.length} background{ownedBackgrounds.length > 1 ? 's' : ''} disponible{ownedBackgrounds.length > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => { setIsOpen(false) }}
                  className='text-white hover:bg-white/20 rounded-full p-2 transition-colors'
                  disabled={isOperating}
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className='p-6 overflow-y-auto max-h-[calc(90vh-180px)]'>
              {ownedBackgrounds.length === 0
                ? (
                  <div className='text-center py-12'>
                    <span className='text-6xl mb-4 block'>🛍️</span>
                    <p className='text-xl font-bold text-chestnut-deep mb-2'>
                      Aucun background possédé
                    </p>
                    <p className='text-sm text-chestnut-medium mb-6'>
                      Visitez la boutique pour acheter des backgrounds
                    </p>
                    <a
                      href='/shop'
                      className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-monster-purple to-pastel-lavender text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200'
                    >
                      <span>🛒</span>
                      <span>Aller à la boutique</span>
                    </a>
                  </div>
                  )
                : (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                    {ownedBackgrounds.map(bg => {
                      const info = getBackgroundInfo(bg.backgroundId)
                      if (info == null) return null

                      const isEquipped = equippedBackground?._id === bg._id

                      return (
                        <button
                          key={bg._id}
                          onClick={() => { handleEquip(bg._id) }}
                          disabled={isOperating || isEquipped}
                          className={`
                            relative group rounded-xl overflow-hidden border-2 transition-all duration-200
                            ${isEquipped
                              ? 'border-moss-medium bg-moss-soft/20 cursor-default'
                              : 'border-pastel-lavender/30 hover:border-monster-purple hover:shadow-lg hover:scale-105'
                            }
                            ${isOperating ? 'opacity-50 cursor-wait' : ''}
                          `}
                        >
                          {/* Preview */}
                          <div className='relative aspect-square'>
                            <Image
                              src={info.assetPath}
                              alt={info.name}
                              fill
                              className='object-cover'
                              sizes='200px'
                            />
                            {isEquipped && (
                              <div className='absolute inset-0 bg-moss-medium/20 flex items-center justify-center'>
                                <span className='text-4xl'>✓</span>
                              </div>
                            )}
                          </div>

                          {/* Name */}
                          <div className='p-3 bg-white'>
                            <p className='text-sm font-semibold text-chestnut-deep truncate'>
                              {info.name}
                            </p>
                            {isEquipped && (
                              <p className='text-xs text-moss-medium font-medium mt-1'>
                                Équipé
                              </p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
