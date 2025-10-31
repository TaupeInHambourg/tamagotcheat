/**
 * Shop Page Client Component
 *
 * Handles the interactive shop interface with filtering and purchasing.
 * Separated from server component to enable client-side interactivity.
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import AccessoryCard from '@/components/accessories/AccessoryCard'
import { purchaseAccessory } from '@/actions/accessories.actions'
import {
  ACCESSORIES_CATALOG,
  CATEGORY_CONFIG,
  getAccessoryPrice
} from '@/config/accessories.config'
import type { AccessoryCategory } from '@/types/accessory.types'

interface CategoryFilter {
  id: AccessoryCategory | 'all'
  name: string
  emoji: string
}

interface ShopClientProps {
  /** User's current Koins balance */
  userKoins: number
  /** Array of accessory IDs the user already owns */
  ownedAccessoryIds: string[]
}

export default function ShopClient ({
  userKoins,
  ownedAccessoryIds
}: ShopClientProps): ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [currentKoins, setCurrentKoins] = useState(userKoins)
  const [ownedIds, setOwnedIds] = useState(ownedAccessoryIds)

  const categoryFilters: CategoryFilter[] = [
    { id: 'all', name: 'Tous', emoji: '🎨' },
    { id: 'hat', name: CATEGORY_CONFIG.hat.name, emoji: CATEGORY_CONFIG.hat.emoji },
    { id: 'glasses', name: CATEGORY_CONFIG.glasses.name, emoji: CATEGORY_CONFIG.glasses.emoji },
    { id: 'shoes', name: CATEGORY_CONFIG.shoes.name, emoji: CATEGORY_CONFIG.shoes.emoji }
  ]

  const filteredAccessories = selectedCategory === 'all'
    ? ACCESSORIES_CATALOG
    : ACCESSORIES_CATALOG.filter(accessory => accessory.category === selectedCategory)

  const handleCategoryChange = (category: AccessoryCategory | 'all'): void => {
    setSelectedCategory(category)
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
          setOwnedIds(prev => [...prev, accessoryId])

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

  return (
    <div className='py-12 px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-12'>
          <h1 className='text-5xl sm:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-4'>
            Boutique d'Accessoires 🛍️
          </h1>
          <p className='text-xl text-chestnut-medium leading-relaxed'>
            Personnalise tes créatures avec style ! Découvre notre collection d'accessoires uniques.
          </p>

          {/* Koins balance */}
          <div className='mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-autumn-cream to-autumn-peach/50 rounded-full px-6 py-3 shadow-md border border-autumn-peach'>
            <span className='text-2xl'>💰</span>
            <span className='text-xl font-bold text-chestnut-deep'>
              {currentKoins}
            </span>
            <span className='text-sm text-chestnut-medium'>Koins disponibles</span>
          </div>

          <p className='text-sm text-chestnut-soft mt-4'>
            {filteredAccessories.length} accessoire{filteredAccessories.length > 1 ? 's' : ''} disponible{filteredAccessories.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Category Filters */}
        <div className='flex flex-wrap gap-2 mb-8'>
          {categoryFilters.map(category => (
            <button
              key={category.id}
              onClick={() => { handleCategoryChange(category.id) }}
              className={`
                px-4 py-2 rounded-xl
                font-semibold text-sm
                transition-all duration-300
                flex items-center gap-2
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

        {/* Accessories Grid */}
        {filteredAccessories.length > 0
          ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
              {filteredAccessories.map(accessory => {
                const price = getAccessoryPrice(accessory)
                const isOwned = ownedIds.includes(accessory.id)
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
            <div className='card-cozy text-center py-16 mb-12'>
              <div className='text-6xl mb-4'>😢</div>
              <p className='text-2xl font-bold text-chestnut-deep mb-2'>
                Aucun accessoire trouvé
              </p>
              <p className='text-chestnut-medium'>
                Essaye une autre catégorie !
              </p>
            </div>
            )}

        {/* Info Section */}
        <div className='card-cozy'>
          <h2 className='text-2xl font-black text-chestnut-deep text-center flex items-center justify-center gap-2 mb-6'>
            <span>💡</span>
            <span>À propos des accessoires</span>
          </h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center space-y-2'>
              <div className='text-4xl'>🎨</div>
              <h3 className='font-bold text-chestnut-deep'>Personnalisation</h3>
              <p className='text-sm text-chestnut-soft'>
                Rends tes créatures uniques avec des accessoires variés
              </p>
            </div>
            <div className='text-center space-y-2'>
              <div className='text-4xl'>⭐</div>
              <h3 className='font-bold text-chestnut-deep'>Système de Rareté</h3>
              <p className='text-sm text-chestnut-soft'>
                Du commun au légendaire, collectionne-les tous !
              </p>
            </div>
            <div className='text-center space-y-2'>
              <div className='text-4xl'>🪙</div>
              <h3 className='font-bold text-chestnut-deep'>Achats avec Koins</h3>
              <p className='text-sm text-chestnut-soft'>
                Utilise tes Koins pour acheter des accessoires et personnaliser tes créatures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
