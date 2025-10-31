/**
 * PixelMonster Component
 *
 * Renders a Tamagotchi-style monster with pixel art on Canvas.
 * Supports dynamic accessories that can be equipped and displayed.
 *
 * Architecture:
 * - Client component (Canvas API + animations)
 * - Single Responsibility: Monster visual rendering
 * - Integrates with accessory system
 *
 * Adapted from RiusmaX/v0-tamagotcho but simplified for TamagoTcheat.
 * Monsters are rendered from SVG assets, accessories are pixel art overlays.
 *
 * @module components/monsters
 */

'use client'

import { useEffect, useRef } from 'react'
import { drawEquippedAccessories } from '@/utils/accessory-renderer'
import type { MonsterState } from '@/types/monster.types'

interface PixelMonsterProps {
  /** SVG path of the monster image */
  imageSrc: string
  /** Current emotional state of the monster */
  state?: MonsterState
  /** Equipped accessories */
  accessories?: {
    hat?: string
    glasses?: string
    shoes?: string
  }
  /** Canvas size (default: 160x160) */
  size?: number
}

/**
 * PixelMonster - Hybrid SVG + Canvas monster renderer
 *
 * This component uses a unique approach:
 * 1. Displays the base monster as an SVG image (existing assets)
 * 2. Overlays a Canvas for pixel art accessories
 * 3. Synchronizes animations between both layers
 *
 * This approach allows us to keep existing monster SVG assets
 * while adding pixel art accessories on top.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <PixelMonster
 *   imageSrc="/assets/tamagocheats/chat-cosmique/happy.svg"
 *   state="happy"
 *   accessories={{
 *     hat: 'hat-crown',
 *     glasses: 'glasses-sun'
 *   }}
 * />
 * ```
 */
export function PixelMonster ({
  imageSrc,
  state = 'happy',
  accessories,
  size = 160
}: PixelMonsterProps): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    canvas.width = size
    canvas.height = size

    let animationId: number

    /**
     * Animation loop for accessories
     *
     * Continuously redraws accessories with animation frames.
     * The monster SVG remains static underneath.
     */
    const animate = (): void => {
      frameRef.current += 1

      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, size, size)

      // Draw accessories if any are equipped
      if (accessories != null && (accessories.hat != null || accessories.glasses != null || accessories.shoes != null)) {
        const centerX = size / 2
        const bodyY = size * 0.4 // Position accessories relative to monster center

        drawEquippedAccessories(
          ctx,
          accessories,
          bodyY,
          centerX,
          6, // pixelSize
          frameRef.current
        )
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [accessories, size])

  return (
    <div
      className='relative'
      style={{ width: size, height: size }}
    >
      {/* Base monster SVG */}
      <img
        src={imageSrc}
        alt='Monster'
        className='absolute inset-0 h-full w-full object-contain'
        style={{ zIndex: 1 }}
      />

      {/* Accessories overlay canvas */}
      <canvas
        ref={canvasRef}
        className='pixel-art absolute inset-0 h-full w-full'
        style={{
          imageRendering: 'pixelated',
          zIndex: 2,
          pointerEvents: 'none' // Allow clicks to pass through to monster
        }}
      />
    </div>
  )
}
