/**
 * AccessoryPreview Component
 *
 * Displays a pixel art preview of an accessory on a Canvas element.
 * Used in the shop and accessory selection interfaces.
 *
 * Architecture:
 * - Client component (uses Canvas API and animations)
 * - Single Responsibility: Preview rendering only
 * - Depends on accessory-renderer abstraction
 *
 * @module components/accessories
 */

'use client'

import { useEffect, useRef } from 'react'
import { drawAccessoryCentered } from '@/utils/accessory-renderer'
import { getRarityConfig } from '@/config/accessories.config'
import type { AccessoryCategory, Rarity } from '@/types/accessory.types'

interface AccessoryPreviewProps {
  /** Unique identifier of the accessory to preview */
  accessoryId: string
  /** Category of the accessory (determines rendering logic) */
  category: AccessoryCategory
  /** Rarity level (affects background styling) */
  rarity: Rarity
  /** Canvas size in pixels (default: 128) */
  size?: number
}

/**
 * Get rarity-based background gradient
 *
 * Creates a subtle gradient background based on rarity level.
 * Enhances visual hierarchy in the shop.
 *
 * @param rarity - Rarity level of the accessory
 * @returns Tailwind CSS classes for background
 */
function getRarityBackground (rarity: Rarity): string {
  const config = getRarityConfig(rarity)
  return `bg-gradient-to-br ${config.color} bg-opacity-20`
}

/**
 * AccessoryPreview - Pixel art preview of accessories
 *
 * Renders a single accessory in pixel art style on a Canvas element.
 * Includes smooth animations for dynamic accessories (e.g., roller skate wheels).
 *
 * Features:
 * - Auto-animating canvas (60fps)
 * - Pixelated rendering style
 * - Rarity-based background
 * - Centered composition
 * - Clean memory management
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <AccessoryPreview
 *   accessoryId="hat-crown"
 *   category="hat"
 *   rarity="legendary"
 * />
 * ```
 */
export function AccessoryPreview ({
  accessoryId,
  category,
  rarity,
  size = 128
}: AccessoryPreviewProps): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    // Set canvas dimensions
    canvas.width = size
    canvas.height = size

    let animationId: number

    /**
     * Animation loop
     *
     * Continuously redraws the accessory with updated frame count.
     * This enables smooth animations for dynamic accessories.
     */
    const animate = (): void => {
      frameRef.current += 1

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Draw accessory centered
      drawAccessoryCentered(
        ctx,
        accessoryId,
        category,
        size,
        size,
        6, // pixelSize
        frameRef.current
      )

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup: Stop animation when component unmounts
    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [accessoryId, category, size])

  return (
    <div
      className={`
        relative
        mx-auto
        flex
        items-center
        justify-center
        rounded-lg
      `}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        className='pixel-art h-full w-full'
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
