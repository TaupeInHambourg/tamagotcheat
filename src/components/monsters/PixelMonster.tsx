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
import Image from 'next/image'
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
  /** Background image path (optional) */
  backgroundPath?: string
  /** Canvas size (default: 160x160) */
  size?: number
}

/**
 * PixelMonster - Hybrid SVG + Canvas monster renderer with background support
 *
 * This component uses a layered approach:
 * 1. Displays an optional background image (z-index: 0)
 * 2. Displays the base monster as an SVG image (z-index: 1)
 * 3. Overlays a Canvas for pixel art accessories (z-index: 2)
 * 4. Synchronizes animations between layers
 *
 * This approach allows us to keep existing monster SVG assets
 * while adding backgrounds and pixel art accessories.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <PixelMonster
 *   imageSrc="/assets/tamagocheats/chat-cosmique/happy.svg"
 *   backgroundPath="/assets/backgrounds/bg_autumn_forest.svg"
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
  backgroundPath,
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
      className='relative overflow-hidden'
      style={{ width: '100%', height: '100%' }}
    >
      {/* Background layer (z-index: 0) - full width/height */}
      {backgroundPath != null && (
        <div className='absolute inset-0' style={{ zIndex: 0 }}>
          <Image
            src={backgroundPath}
            alt='Background'
            fill
            className='object-cover'
            sizes={`${size}px`}
            priority={false}
          />
          {/* Subtle overlay to ensure creature visibility */}
          <div
            className='absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/15'
            style={{ zIndex: 0 }}
          />
        </div>
      )}

      {/* Centered container for monster and accessories with fixed size */}
      <div
        className='absolute inset-0 flex items-center justify-center'
        style={{ zIndex: 1 }}
      >
        <div
          className='relative'
          style={{ width: size, height: size }}
        >
          {/* Base monster SVG */}
          <img
            src={imageSrc}
            alt='Monster'
            className='absolute inset-0 h-full w-full object-contain'
          />

          {/* Accessories overlay canvas */}
          <canvas
            ref={canvasRef}
            className='pixel-art absolute inset-0 h-full w-full'
            style={{
              imageRendering: 'pixelated',
              pointerEvents: 'none' // Allow clicks to pass through to monster
            }}
          />
        </div>
      </div>
    </div>
  )
}
