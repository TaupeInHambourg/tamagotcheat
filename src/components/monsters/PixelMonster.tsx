/**
 * PixelMonster Component
 *
 * Renders a Tamagotchi-style monster with pixel art accessories integrated into the SVG.
 * Accessories are injected as <image> elements directly into the monster's SVG DOM.
 *
 * Architecture:
 * - Client component (SVG manipulation + Canvas for pixel art)
 * - Single Responsibility: Monster visual rendering
 * - Integrates with accessory system
 *
 * Adapted from RiusmaX/v0-tamagotcho but simplified for TamagoTcheat.
 * Monsters are SVG, accessories are pixel art Canvas converted to data URIs.
 *
 * @module components/monsters
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { getMonsterAccessoryPositions } from '@/config/monster-accessory-positions.config'
import { accessoryToDataURI } from '@/utils/accessory-to-data-uri'
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
 * PixelMonster - SVG-based monster renderer with pixel art accessories
 *
 * This component uses a hybrid approach:
 * 1. Fetches the base monster SVG file
 * 2. Generates pixel art accessories as Canvas data URIs
 * 3. Injects accessories as <image> elements into the monster's .monster-body group
 * 4. Accessories inherit the monster's CSS animations automatically
 *
 * This ensures:
 * - Pixel art style is preserved (Canvas rendering)
 * - Perfect animation synchronization (SVG integration)
 * - Monster animations remain unchanged
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    // Fetch the original SVG
    fetch(imageSrc)
      .then(async response => await response.text())
      .then(svgText => {
        // Parse SVG
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
        const svgElement = svgDoc.querySelector('svg')

        if (svgElement == null) {
          console.error('Failed to parse SVG')
          return
        }

        // Get accessory positions for this monster
        const positions = getMonsterAccessoryPositions(imageSrc)

        // Create a group for accessories that will be affected by monster animations
        const accessoriesGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
        accessoriesGroup.setAttribute('class', 'accessories-layer')

        // Add shoes (bottom layer) - positioned at configured coordinates
        if (accessories?.shoes != null) {
          const shoesDataURI = accessoryToDataURI(accessories.shoes, 'shoes', 2)
          const shoesImage = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'image')
          
          const shoesY = (positions.shoes.y / 100) * 32 // Convert percentage to viewBox coordinates (32x32)
          const shoesX = (positions.shoes.x / 100) * 32
          
          // Use natural canvas size: 240x160
          const canvasWidth = 240
          const canvasHeight = 160
          const viewBoxSize = 32
          const imageWidth = viewBoxSize // Map full canvas width to viewBox
          const imageHeight = (canvasHeight / canvasWidth) * viewBoxSize // Maintain aspect ratio
          
          shoesImage.setAttribute('href', shoesDataURI)
          shoesImage.setAttribute('x', String(shoesX - imageWidth / 2))
          shoesImage.setAttribute('y', String(shoesY - imageHeight / 2))
          shoesImage.setAttribute('width', String(imageWidth))
          shoesImage.setAttribute('height', String(imageHeight))
          shoesImage.setAttribute('style', 'image-rendering: pixelated; image-rendering: crisp-edges;')
          
          accessoriesGroup.appendChild(shoesImage)
        }

        // Add glasses (middle layer)
        if (accessories?.glasses != null) {
          const glassesDataURI = accessoryToDataURI(accessories.glasses, 'glasses', 2)
          const glassesImage = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'image')
          
          const glassesY = (positions.glasses.y / 100) * 32
          const glassesX = (positions.glasses.x / 100) * 32
          
          // Use natural canvas size: 240x120
          const canvasWidth = 240
          const canvasHeight = 120
          const viewBoxSize = 32
          const imageWidth = viewBoxSize // Map full canvas width to viewBox
          const imageHeight = (canvasHeight / canvasWidth) * viewBoxSize // Maintain aspect ratio
          
          glassesImage.setAttribute('href', glassesDataURI)
          glassesImage.setAttribute('x', String(glassesX - imageWidth / 2))
          glassesImage.setAttribute('y', String(glassesY - imageHeight / 2))
          glassesImage.setAttribute('width', String(imageWidth))
          glassesImage.setAttribute('height', String(imageHeight))
          glassesImage.setAttribute('style', 'image-rendering: pixelated; image-rendering: crisp-edges;')
          
          accessoriesGroup.appendChild(glassesImage)
        }

        // Add hat (top layer)
        if (accessories?.hat != null) {
          const hatDataURI = accessoryToDataURI(accessories.hat, 'hat', 2)
          const hatImage = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'image')
          
          const hatY = (positions.hat.y / 100) * 32
          const hatX = (positions.hat.x / 100) * 32
          
          // Use natural canvas size: 240x240 (square)
          const viewBoxSize = 32
          const imageSize = viewBoxSize // Map full canvas to viewBox (240->32)
          
          hatImage.setAttribute('href', hatDataURI)
          hatImage.setAttribute('x', String(hatX - imageSize / 2))
          hatImage.setAttribute('y', String(hatY - imageSize / 2))
          hatImage.setAttribute('width', String(imageSize))
          hatImage.setAttribute('height', String(imageSize))
          hatImage.setAttribute('style', 'image-rendering: pixelated; image-rendering: crisp-edges;')
          
          accessoriesGroup.appendChild(hatImage)
        }

        // Find the monster body group and append accessories inside it
        // This ensures accessories inherit the body's animation transforms
        const monsterBody = svgElement.querySelector('.monster-body')
        if (monsterBody != null) {
          monsterBody.appendChild(accessoriesGroup)
        } else {
          // Fallback: append to SVG root (animations might not sync)
          console.warn('No .monster-body found, accessories might not animate correctly')
          svgElement.appendChild(accessoriesGroup)
        }

        // Serialize back to string
        const serializer = new XMLSerializer()
        const modifiedSVG = serializer.serializeToString(svgElement)
        setSvgContent(modifiedSVG)
      })
      .catch(error => {
        console.error('Error loading SVG:', error)
      })
  }, [imageSrc, accessories])

  return (
    <div
      ref={containerRef}
      className='monster-container'
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
