/**
 * MonsterWithAccessories Component
 *
 * Wraps PixelMonster to fetch and display equipped accessories.
 * Integrates with the accessories system hooks.
 *
 * Architecture:
 * - Client component (uses hooks for data fetching)
 * - Single Responsibility: Orchestrate monster + accessories display
 * - Depends on use-accessories hooks
 *
 * @module components/monsters
 */

'use client'

import { useEffect, useState } from 'react'
import { PixelMonster } from './PixelMonster'
import { getCreatureEquipment } from '@/actions/accessories.actions'
import { getCreatureBackground } from '@/actions/backgrounds.actions'
import { BACKGROUNDS_CATALOG } from '@/config/backgrounds.config'
import type { MonsterState } from '@/types/monster.types'

interface MonsterWithAccessoriesProps {
  /** Monster unique identifier */
  monsterId: string
  /** SVG path of the monster image */
  imageSrc: string
  /** Current emotional state */
  state?: MonsterState
  /** Canvas size */
  size?: number
  /** Force refresh trigger */
  refreshTrigger?: number
}

/**
 * MonsterWithAccessories - Smart wrapper for PixelMonster
 *
 * This component:
 * 1. Fetches equipped accessories from the server
 * 2. Fetches equipped background
 * 3. Passes them to PixelMonster for rendering
 * 4. Handles loading and error states
 * 5. Supports refresh when accessories/background change
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <MonsterWithAccessories
 *   monsterId="monster_123"
 *   imageSrc="/assets/tamagocheats/chat-cosmique/happy.svg"
 *   state="happy"
 * />
 * ```
 */
export function MonsterWithAccessories ({
  monsterId,
  imageSrc,
  state = 'happy',
  size = 160,
  refreshTrigger = 0
}: MonsterWithAccessoriesProps): React.ReactNode {
  const [accessories, setAccessories] = useState<{
    hat?: string
    glasses?: string
    shoes?: string
  }>({})
  const [backgroundPath, setBackgroundPath] = useState<string>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEquipment = async (): Promise<void> => {
      try {
        setLoading(true)
        
        // Fetch accessories
        const equipment = await getCreatureEquipment(monsterId)

        // Transform equipment to simple ID map
        const accessoryIds: {
          hat?: string
          glasses?: string
          shoes?: string
        } = {}

        if (equipment.hat != null) {
          accessoryIds.hat = equipment.hat.accessoryId
        }
        if (equipment.glasses != null) {
          accessoryIds.glasses = equipment.glasses.accessoryId
        }
        if (equipment.shoes != null) {
          accessoryIds.shoes = equipment.shoes.accessoryId
        }

        setAccessories(accessoryIds)

        // Fetch background
        const background = await getCreatureBackground(monsterId)
        if (background != null) {
          // Find background in catalog to get asset path
          const backgroundConfig = BACKGROUNDS_CATALOG.find(
            bg => bg.id === background.backgroundId
          )
          if (backgroundConfig != null) {
            setBackgroundPath(backgroundConfig.assetPath)
          }
        } else {
          setBackgroundPath(undefined)
        }
      } catch (error) {
        console.error('Failed to fetch equipment:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchEquipment()
  }, [monsterId, refreshTrigger])

  // Show loading state with just the monster (no accessories/background)
  if (loading) {
    return (
      <PixelMonster
        imageSrc={imageSrc}
        state={state}
        size={size}
      />
    )
  }

  return (
    <PixelMonster
      imageSrc={imageSrc}
      state={state}
      accessories={accessories}
      backgroundPath={backgroundPath}
      size={size}
    />
  )
}
