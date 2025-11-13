/**
 * Shop Page Client Component
 *
 * Handles the interactive shop interface with tabs for Accessories, Backgrounds, and Koins.
 * Features filtering, sorting, and purchasing capabilities.
 *
 * Design Principles:
 * - Single Responsibility: Orchestrates shop UI and user interactions
 * - Open/Closed: Filter logic is extensible without modifying this component
 * - Dependency Inversion: Depends on utility functions for business logic
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import AccessoryCard from '@/components/accessories/AccessoryCard'
import BackgroundCard from './BackgroundCard'
import ShopFilters from './ShopFilters'
import { purchaseAccessory } from '@/actions/accessories.actions'
import { purchaseBackground } from '@/actions/backgrounds.actions'
import {
  ACCESSORIES_CATALOG,
  CATEGORY_CONFIG as ACCESSORY_CATEGORY_CONFIG,
  getAccessoryPrice
} from '@/config/accessories.config'
import {
  BACKGROUNDS_CATALOG,
  CATEGORY_CONFIG as BACKGROUND_CATEGORY_CONFIG,
  getBackgroundPrice
} from '@/config/backgrounds.config'
import type { AccessoryCategory } from '@/types/accessory.types'
import type { BackgroundCategory } from '@/types/background.types'
import { applyShopFilters, type SortOrder } from '@/utils/shop-filters'
import Link from 'next/link'

type ShopTab = 'accessories' | 'backgrounds' | 'koins'

interface CategoryFilter {
  id: AccessoryCategory | 'all'
  name: string
  emoji: string
}

interface BackgroundCategoryFilter {
  id: BackgroundCategory | 'all'
  name: string
  emoji: string
}

interface ShopClientProps {
  /** User's current Koins balance */
  userKoins: number
  /** Array of accessory IDs the user already owns */
  ownedAccessoryIds: string[]
  /** Array of background IDs the user already owns */
  ownedBackgroundIds: string[]
}

export default function ShopClient ({
  userKoins,
  ownedAccessoryIds,
  ownedBackgroundIds
}: ShopClientProps): ReactNode {
  // Shop tabs state
  const [activeTab, setActiveTab] = useState<ShopTab>('accessories')

  // Accessories state
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('rarest-first')
  const [hideOwned, setHideOwned] = useState(false)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [currentKoins, setCurrentKoins] = useState(userKoins)
  const [ownedAccessoryIdsState, setOwnedAccessoryIdsState] = useState(ownedAccessoryIds)

  // Backgrounds state
  const [selectedBgCategory, setSelectedBgCategory] = useState<BackgroundCategory | 'all'>('all')
  const [purchasingBgId, setPurchasingBgId] = useState<string | null>(null)
  const [ownedBackgroundIdsState, setOwnedBackgroundIdsState] = useState(ownedBackgroundIds)

  const accessoryCategoryFilters: CategoryFilter[] = [
    { id: 'all', name: 'Tous', emoji: '🎨' },
    { id: 'hat', name: ACCESSORY_CATEGORY_CONFIG.hat.name, emoji: ACCESSORY_CATEGORY_CONFIG.hat.emoji },
    { id: 'glasses', name: ACCESSORY_CATEGORY_CONFIG.glasses.name, emoji: ACCESSORY_CATEGORY_CONFIG.glasses.emoji },
    { id: 'shoes', name: ACCESSORY_CATEGORY_CONFIG.shoes.name, emoji: ACCESSORY_CATEGORY_CONFIG.shoes.emoji }
  ]

  const backgroundCategoryFilters: BackgroundCategoryFilter[] = [
    { id: 'all', name: 'Tous', emoji: '🎨' },
    { id: 'nature', name: BACKGROUND_CATEGORY_CONFIG.nature.name, emoji: BACKGROUND_CATEGORY_CONFIG.nature.emoji },
    { id: 'sky', name: BACKGROUND_CATEGORY_CONFIG.sky.name, emoji: BACKGROUND_CATEGORY_CONFIG.sky.emoji },
    { id: 'abstract', name: BACKGROUND_CATEGORY_CONFIG.abstract.name, emoji: BACKGROUND_CATEGORY_CONFIG.abstract.emoji },
    { id: 'pattern', name: BACKGROUND_CATEGORY_CONFIG.pattern.name, emoji: BACKGROUND_CATEGORY_CONFIG.pattern.emoji }
  ]

  /**
   * Apply category filter for accessories
   * Follows Single Responsibility: only filters by category
   */
  const categoryFilteredAccessories = useMemo(() => {
    return selectedCategory === 'all'
      ? ACCESSORIES_CATALOG
      : ACCESSORIES_CATALOG.filter(accessory => accessory.category === selectedCategory)
  }, [selectedCategory])

  /**
   * Apply category filter for backgrounds
   */
  const categoryFilteredBackgrounds = useMemo(() => {
    return selectedBgCategory === 'all'
      ? BACKGROUNDS_CATALOG
      : BACKGROUNDS_CATALOG.filter(bg => bg.category === selectedBgCategory)
  }, [selectedBgCategory])

  /**
   * Apply sorting and ownership filters for accessories
   * Uses composition of pure functions from shop-filters utility
   */
  const filteredAccessories = useMemo(() => {
    return applyShopFilters(categoryFilteredAccessories, {
      sortOrder,
      hideOwned,
      ownedIds: ownedAccessoryIdsState
    })
  }, [categoryFilteredAccessories, sortOrder, hideOwned, ownedAccessoryIdsState])

  /**
   * Apply sorting and ownership filters for backgrounds
   */
  const filteredBackgrounds = useMemo(() => {
    return applyShopFilters(categoryFilteredBackgrounds, {
      sortOrder,
      hideOwned,
      ownedIds: ownedBackgroundIdsState
    })
  }, [categoryFilteredBackgrounds, sortOrder, hideOwned, ownedBackgroundIdsState])

  const handleCategoryChange = (category: AccessoryCategory | 'all'): void => {
    setSelectedCategory(category)
  }

  const handleBgCategoryChange = (category: BackgroundCategory | 'all'): void => {
    setSelectedBgCategory(category)
  }

  const handlePurchase = (accessoryId: string): void => {
    const accessory = ACCESSORIES_CATALOG.find(acc => acc.id === accessoryId)
    if (accessory == null) return

    const price = getAccessoryPrice(accessory)

    // Confirmation dialog
    const confirmMessage = `Acheter ${accessory.name} pour ${price} Koins ?`
    if (!window.confirm(confirmMessage)) return

    setPurchasingId(accessoryId)

    // Use async/await directly without startTransition
    void (async () => {
      try {
        const result = await purchaseAccessory(accessoryId)

        if (result.success) {
          // Update local state
          setCurrentKoins(prev => prev - price)
          setOwnedAccessoryIdsState(prev => [...prev, accessoryId])

          // Success notification
          alert(`✅ ${accessory.name} acheté avec succès !`)
        } else {
          // Error notification
          alert(`❌ ${result.error ?? 'Erreur lors de l\'achat'}`)
        }
      } catch (error) {
        console.error('Purchase error:', error)
        alert('❌ Une erreur est survenue lors de l\'achat')
      } finally {
        setPurchasingId(null)
      }
    })()
  }

  const handleBackgroundPurchase = (backgroundId: string): void => {
    const background = BACKGROUNDS_CATALOG.find(bg => bg.id === backgroundId)
    if (background == null) return

    const price = getBackgroundPrice(background)

    // Confirmation dialog
    const confirmMessage = `Acheter ${background.name} pour ${price} Koins ?`
    if (!window.confirm(confirmMessage)) return

    setPurchasingBgId(backgroundId)

    void (async () => {
      try {
        const result = await purchaseBackground(backgroundId)

        if (result.success) {
          // Update local state
          setCurrentKoins(prev => prev - price)
          setOwnedBackgroundIdsState(prev => [...prev, backgroundId])

          // Success notification
          alert(`✅ ${background.name} acheté avec succès !`)
        } else {
          // Error notification
          alert(`❌ ${result.error ?? 'Erreur lors de l\'achat'}`)
        }
      } catch (error) {
        console.error('Purchase error:', error)
        alert('❌ Une erreur est survenue lors de l\'achat')
      } finally {
        setPurchasingBgId(null)
      }
    })()
  }

  return (
    <div className='py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 sm:mb-10 lg:mb-12'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
            Boutique 🛍️
          </h1>
          <p className='text-base sm:text-lg lg:text-xl text-chestnut-medium leading-relaxed'>
            Personnalise tes créatures avec style ! Découvre notre collection d'accessoires et backgrounds uniques.
          </p>

          {/* Koins balance */}
          <div className='mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-autumn-cream to-autumn-peach/50 rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-md border border-autumn-peach'>
            <span className='text-xl sm:text-2xl'>💰</span>
            <span className='text-lg sm:text-xl font-bold text-chestnut-deep'>
              {currentKoins}
            </span>
            <span className='text-xs sm:text-sm text-chestnut-medium'>Koins disponibles</span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className='flex flex-wrap gap-3 mb-6 sm:mb-8 border-b border-chestnut-light pb-4'>
          <button
            onClick={() => { setActiveTab('accessories') }}
            className={`
              px-4 py-2.5 sm:px-6 sm:py-3 rounded-t-xl font-bold text-sm sm:text-base
              transition-all duration-300 flex items-center gap-2
              ${activeTab === 'accessories'
                ? 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white shadow-md -mb-[1px] border-b-2 border-transparent'
                : 'bg-white text-chestnut-deep hover:bg-autumn-cream/50'
              }
            `}
          >
            <span>🎨</span>
            <span>Accessoires</span>
            <span className='px-2 py-0.5 rounded-full bg-white/20 text-xs'>{ACCESSORIES_CATALOG.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('backgrounds') }}
            className={`
              px-4 py-2.5 sm:px-6 sm:py-3 rounded-t-xl font-bold text-sm sm:text-base
              transition-all duration-300 flex items-center gap-2
              ${activeTab === 'backgrounds'
                ? 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white shadow-md -mb-[1px] border-b-2 border-transparent'
                : 'bg-white text-chestnut-deep hover:bg-autumn-cream/50'
              }
            `}
          >
            <span>🖼️</span>
            <span>Backgrounds</span>
            <span className='px-2 py-0.5 rounded-full bg-white/20 text-xs'>{BACKGROUNDS_CATALOG.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('koins') }}
            className={`
              px-4 py-2.5 sm:px-6 sm:py-3 rounded-t-xl font-bold text-sm sm:text-base
              transition-all duration-300 flex items-center gap-2
              ${activeTab === 'koins'
                ? 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white shadow-md -mb-[1px] border-b-2 border-transparent'
                : 'bg-white text-chestnut-deep hover:bg-autumn-cream/50'
              }
            `}
          >
            <span>🪙</span>
            <span>Acheter des Koins</span>
          </button>
        </div>

        {/* Tab Content: Accessories */}
        {activeTab === 'accessories' && (
          <>
            <p className='text-xs sm:text-sm text-chestnut-soft mb-4'>
              {filteredAccessories.length} accessoire{filteredAccessories.length > 1 ? 's' : ''} disponible{filteredAccessories.length > 1 ? 's' : ''}
            </p>

            {/* Category Filters */}
            <div className='flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8'>
              {/* Category Buttons */}
              <div className='flex flex-wrap gap-2'>
                {accessoryCategoryFilters.map(category => (
                  <button
                    key={category.id}
                    onClick={() => { handleCategoryChange(category.id) }}
                    className={`
                      px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl
                      font-semibold text-xs sm:text-sm
                      transition-all duration-300
                      flex items-center gap-1.5 sm:gap-2
                      hover:-translate-y-0.5
                      ${selectedCategory === category.id
                        ? 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white shadow-md ring-2 ring-autumn-cinnamon/30'
                        : 'bg-white text-chestnut-deep ring-1 ring-chestnut-light hover:ring-2 hover:ring-autumn-coral hover:shadow-md'
                      }
                    `}
                  >
                    <span>{category.emoji}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Sort and Visibility Filters */}
              <ShopFilters
                sortOrder={sortOrder}
                hideOwned={hideOwned}
                onSortChange={setSortOrder}
                onHideOwnedChange={setHideOwned}
                ownedCount={ownedAccessoryIdsState.length}
              />
            </div>

            {/* Accessories Grid */}
            {filteredAccessories.length > 0
              ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12'>
                  {filteredAccessories.map(accessory => {
                    const price = getAccessoryPrice(accessory)
                    const isOwned = ownedAccessoryIdsState.includes(accessory.id)
                    const canAfford = currentKoins >= price
                    const isPurchasing = purchasingId === accessory.id

                    return (
                      <AccessoryCard
                        key={accessory.id}
                        accessory={accessory}
                        onPurchase={handlePurchase}
                        canAfford={canAfford}
                        isOwned={isOwned}
                        isPurchasing={isPurchasing}
                      />
                    )
                  })}
                </div>
                )
              : (
                <div className='card-cozy text-center py-12 sm:py-16 mb-8 sm:mb-10 lg:mb-12'>
                  <div className='text-5xl sm:text-6xl mb-3 sm:mb-4'>😢</div>
                  <p className='text-xl sm:text-2xl font-bold text-chestnut-deep mb-2'>
                    Aucun accessoire trouvé
                  </p>
                  <p className='text-sm sm:text-base text-chestnut-medium'>
                    Essaye une autre catégorie !
                  </p>
                </div>
                )}
          </>
        )}

        {/* Tab Content: Backgrounds */}
        {activeTab === 'backgrounds' && (
          <>
            <p className='text-xs sm:text-sm text-chestnut-soft mb-4'>
              {filteredBackgrounds.length} background{filteredBackgrounds.length > 1 ? 's' : ''} disponible{filteredBackgrounds.length > 1 ? 's' : ''}
            </p>

            {/* Category Filters */}
            <div className='flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8'>
              {/* Category Buttons */}
              <div className='flex flex-wrap gap-2'>
                {backgroundCategoryFilters.map(category => (
                  <button
                    key={category.id}
                    onClick={() => { handleBgCategoryChange(category.id) }}
                    className={`
                      px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl
                      font-semibold text-xs sm:text-sm
                      transition-all duration-300
                      flex items-center gap-1.5 sm:gap-2
                      hover:-translate-y-0.5
                      ${selectedBgCategory === category.id
                        ? 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white shadow-md ring-2 ring-autumn-cinnamon/30'
                        : 'bg-white text-chestnut-deep ring-1 ring-chestnut-light hover:ring-2 hover:ring-autumn-coral hover:shadow-md'
                      }
                    `}
                  >
                    <span>{category.emoji}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Sort and Visibility Filters */}
              <ShopFilters
                sortOrder={sortOrder}
                hideOwned={hideOwned}
                onSortChange={setSortOrder}
                onHideOwnedChange={setHideOwned}
                ownedCount={ownedBackgroundIdsState.length}
              />
            </div>

            {/* Backgrounds Grid */}
            {filteredBackgrounds.length > 0
              ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12'>
                  {filteredBackgrounds.map(background => {
                    const price = getBackgroundPrice(background)
                    const isOwned = ownedBackgroundIdsState.includes(background.id)
                    const canAfford = currentKoins >= price
                    const isPurchasing = purchasingBgId === background.id

                    return (
                      <BackgroundCard
                        key={background.id}
                        background={background}
                        onPurchase={handleBackgroundPurchase}
                        canAfford={canAfford}
                        isOwned={isOwned}
                        isPurchasing={isPurchasing}
                      />
                    )
                  })}
                </div>
                )
              : (
                <div className='card-cozy text-center py-12 sm:py-16 mb-8 sm:mb-10 lg:mb-12'>
                  <div className='text-5xl sm:text-6xl mb-3 sm:mb-4'>😢</div>
                  <p className='text-xl sm:text-2xl font-bold text-chestnut-deep mb-2'>
                    Aucun background trouvé
                  </p>
                  <p className='text-sm sm:text-base text-chestnut-medium'>
                    Essaye une autre catégorie !
                  </p>
                </div>
                )}
          </>
        )}

        {/* Tab Content: Koins */}
        {activeTab === 'koins' && (
          <div className='max-w-2xl mx-auto'>
            <div className='card-cozy text-center py-12 sm:py-16'>
              <div className='text-5xl sm:text-6xl mb-4'>🪙</div>
              <h2 className='text-2xl sm:text-3xl font-bold text-chestnut-deep mb-3'>
                Besoin de plus de Koins ?
              </h2>
              <p className='text-sm sm:text-base text-chestnut-medium mb-6'>
                Achète des packs de Koins pour débloquer plus d'accessoires et backgrounds !
              </p>

              <Link
                href='/wallet'
                className='inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300'
              >
                <span>💰</span>
                <span>Acheter des Koins</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Info Section - Only show for accessories and backgrounds tabs */}
        {(activeTab === 'accessories' || activeTab === 'backgrounds') && (
          <div className='card-cozy'>
            <h2 className='text-xl sm:text-2xl font-black text-chestnut-deep text-center flex items-center justify-center gap-2 mb-4 sm:mb-6'>
              <span>💡</span>
              <span>À propos {activeTab === 'accessories' ? 'des accessoires' : 'des backgrounds'}</span>
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              <div className='text-center space-y-2'>
                <div className='text-3xl sm:text-4xl'>🎨</div>
                <h3 className='text-sm sm:text-base font-bold text-chestnut-deep'>Personnalisation</h3>
                <p className='text-xs sm:text-sm text-chestnut-soft'>
                  Rends tes créatures uniques avec {activeTab === 'accessories' ? 'des accessoires variés' : 'des backgrounds magnifiques'}
                </p>
              </div>
              <div className='text-center space-y-2'>
                <div className='text-3xl sm:text-4xl'>⭐</div>
                <h3 className='text-sm sm:text-base font-bold text-chestnut-deep'>Système de Rareté</h3>
                <p className='text-xs sm:text-sm text-chestnut-soft'>
                  Du commun au légendaire, collectionne-les tous !
                </p>
              </div>
              <div className='text-center space-y-2'>
                <div className='text-3xl sm:text-4xl'>🪙</div>
                <h3 className='text-sm sm:text-base font-bold text-chestnut-deep'>Achats avec Koins</h3>
                <p className='text-xs sm:text-sm text-chestnut-soft'>
                  Utilise tes Koins pour personnaliser tes créatures
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
