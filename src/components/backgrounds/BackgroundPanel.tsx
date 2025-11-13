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
 * - Custom Hooks: Encapsulates complex logic for better reusability
 *
 * @module components/backgrounds
 */

'use client'

import { type ReactNode } from 'react'
import Image from 'next/image'
import { useBackgroundManagement } from '@/hooks/use-background-management'
import { useToggle } from '@/hooks/use-toggle'
import { BACKGROUNDS_CATALOG } from '@/config/backgrounds.config'
import type { Background } from '@/types/background.types'

interface BackgroundPanelProps {
  /** Monster ID to manage background for */
  monsterId: string
  /** Callback when background changes (for parent refresh) */
  onBackgroundChange?: () => void
}

/**
 * Get background info from catalog
 */
const getBackgroundInfo = (backgroundId: string): Background | undefined => {
  return BACKGROUNDS_CATALOG.find(bg => bg.id === backgroundId)
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
 * - Custom Hooks: Separates state management from presentation
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
}: BackgroundPanelProps): ReactNode {
  // Modal state management
  const [isOpen, , openModal, closeModal] = useToggle(false)

  // Background state management
  const {
    availableBackgrounds,
    equippedBackground,
    isLoading,
    isOperating,
    handleEquip,
    handleUnequip
  } = useBackgroundManagement({ monsterId, onBackgroundChange })

  /**
   * Handle background equip with modal closure
   */
  const onEquip = (backgroundDbId: string): void => {
    void (async () => {
      await handleEquip(backgroundDbId)
      closeModal()
    })()
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
    <div className='rounded-2xl bg-gradient-to-br from-pastel-sky to-pastel-lavender/30 p-4 shadow-md border-2 border-pastel-lavender/30'>
      {/* Compact Header */}
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>🖼️</span>
          <h3 className='text-lg font-bold text-chestnut-deep'>
            Background
          </h3>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2'>
          {equippedBackground != null && (
            <button
              onClick={() => { void handleUnequip() }}
              disabled={isOperating}
              className='px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-maple-warm to-maple-deep rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isOperating ? '⏳' : '✖️'} Retirer
            </button>
          )}
          <button
            onClick={openModal}
            disabled={isOperating || availableBackgrounds.length === 0}
            className='px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-monster-purple to-pastel-lavender rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1'
          >
            {availableBackgrounds.length === 0
              ? (
                <>
                  <span>🛍️</span>
                  <span>Acheter</span>
                </>
                )
              : (
                <>
                  <span>🎨</span>
                  <span>Changer ({availableBackgrounds.length})</span>
                </>
                )}
          </button>
        </div>
      </div>

      {/* Compact Background Display */}
      {equippedBackground != null && equippedInfo != null
        ? (
          <div className='flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-pastel-lavender/30'>
            {/* Small Preview */}
            <div className='relative w-16 h-16 rounded-lg overflow-hidden shadow-sm border-2 border-pastel-lavender/50 flex-shrink-0'>
              <Image
                src={equippedInfo.assetPath}
                alt={equippedInfo.name}
                fill
                className='object-cover'
                sizes='64px'
              />
            </div>

            {/* Info */}
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-chestnut-deep truncate'>
                {equippedInfo.name}
              </p>
              <p className='text-xs text-chestnut-medium truncate'>
                {equippedInfo.description}
              </p>
            </div>
          </div>
          )
        : (
          <button
            onClick={openModal}
            disabled={isOperating}
            className='w-full p-4 bg-white/50 rounded-xl border-2 border-dashed border-pastel-lavender/50 hover:border-monster-purple hover:bg-white/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group'
          >
            <div className='flex flex-col items-center justify-center gap-2'>
              <span className='text-3xl group-hover:scale-110 transition-transform duration-200'>🖼️</span>
              <p className='text-xs text-chestnut-medium font-medium'>Aucun background équipé</p>
              <p className='text-xs text-monster-purple font-semibold'>
                {availableBackgrounds.length > 0
                  ? `Cliquez pour choisir (${availableBackgrounds.length} disponible${availableBackgrounds.length > 1 ? 's' : ''})`
                  : 'Cliquez pour acheter'}
              </p>
            </div>
          </button>
          )}

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
                    {availableBackgrounds.length} background{availableBackgrounds.length > 1 ? 's' : ''} disponible{availableBackgrounds.length > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={closeModal}
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
              {availableBackgrounds.length === 0
                ? (
                  <div className='text-center py-12'>
                    <span className='text-6xl mb-4 block'>🛍️</span>
                    <p className='text-xl font-bold text-chestnut-deep mb-2'>
                      Aucun background disponible
                    </p>
                    <p className='text-sm text-chestnut-medium mb-6'>
                      Tous vos backgrounds sont équipés ou vous n'en possédez pas encore
                    </p>
                    <a
                      href='/shop'
                      className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-monster-purple to-pastel-lavender text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200'
                    >
                      <span>🛍️</span>
                      <span>Aller à la boutique</span>
                    </a>
                  </div>
                  )
                : (
                  <>
                    {/* Shop Button */}
                    <div className='mb-4'>
                      <a
                        href='/shop'
                        className='inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-pastel-lavender/30 text-chestnut-deep font-semibold rounded-lg hover:border-monster-purple hover:shadow-md transition-all duration-200'
                      >
                        <span>🛍️</span>
                        <span>Acheter plus de backgrounds</span>
                      </a>
                    </div>

                    {/* Backgrounds Grid */}
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                      {availableBackgrounds.map(bg => {
                        const info = getBackgroundInfo(bg.backgroundId)
                        if (info == null) return null

                        return (
                          <button
                            key={bg._id}
                            onClick={() => { onEquip(bg._id) }}
                            disabled={isOperating}
                            className='relative group rounded-xl overflow-hidden border-2 transition-all duration-200 border-pastel-lavender/30 hover:border-monster-purple hover:shadow-lg hover:scale-105'
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
                            </div>

                            {/* Name */}
                            <div className='p-3 bg-white'>
                              <p className='text-sm font-semibold text-chestnut-deep truncate'>
                                {info.name}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </>
                  )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
