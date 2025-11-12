/**
 * Monster Utility Functions
 *
 * Provides helper functions for monster-related operations,
 * particularly color matching and template selection.
 *
 * Follows Clean Code principles:
 * - Small, focused functions with single responsibilities
 * - Clear, descriptive names
 * - Proper error handling and type safety
 */

import { MonsterTemplate, MonsterTemplates } from '@/types/monster.types'

/**
 * RGB color representation
 */
interface RGBColor {
  r: number
  g: number
  b: number
}

/**
 * Converts a hexadecimal color string to RGB values
 *
 * @param hex - Hexadecimal color string (e.g., '#FF69B4' or 'FF69B4')
 * @returns RGB color object or null if invalid format
 *
 * @example
 * ```ts
 * const rgb = hexToRgb('#FF69B4')
 * // Returns: { r: 255, g: 105, b: 180 }
 * ```
 */
function hexToRgb (hex: string): RGBColor | null {
  // Match hex pattern with optional # prefix
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (result === null) {
    return null
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

/**
 * Calculates the Euclidean distance between two colors in RGB space
 *
 * Uses the standard Euclidean distance formula:
 * √((r2-r1)² + (g2-g1)² + (b2-b1)²)
 *
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @returns Distance value (lower means more similar), or Infinity if invalid
 *
 * @example
 * ```ts
 * const distance = colorDistance('#FF0000', '#FF0001')
 * // Returns: ~1.0 (very close colors)
 * ```
 */
function colorDistance (color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (rgb1 === null || rgb2 === null) {
    return Infinity
  }

  return Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  )
}

/**
 * Finds the monster template with colors closest to the given color
 *
 * Iterates through all available monster templates and their color ranges,
 * calculating the distance to find the best match using Euclidean distance
 * in RGB color space.
 *
 * @param color - Target color in hex format
 * @returns The monster template with the closest matching color
 *
 * @example
 * ```ts
 * const template = findMonsterTemplateByColor('#FF69B4')
 * // Returns: The pink cat template (closest match)
 * ```
 */
export function findMonsterTemplateByColor (color: string): MonsterTemplate {
  const availableTemplates = Object.values(MonsterTemplates)
  let closestMonster = availableTemplates[0]
  let minDistance = Infinity

  availableTemplates.forEach((monster: MonsterTemplate) => {
    monster.colorRange.forEach((rangeColor: string) => {
      const distance = colorDistance(color, rangeColor)
      if (distance < minDistance) {
        minDistance = distance
        closestMonster = monster
      }
    })
  })

  return closestMonster
}
