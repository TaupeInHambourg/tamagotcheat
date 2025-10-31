/**
 * Accessory Pixel Art Renderer
 *
 * Handles the rendering of accessories as pixel art on Canvas.
 * Adapted from RiusmaX/v0-tamagotcho for TamagoTcheat.
 *
 * Architecture:
 * - Pure rendering functions (no side effects)
 * - Single Responsibility: Only renders pixels
 * - Open/Closed: New accessories can be added without modifying core logic
 *
 * @module accessory-renderer
 */

import type { AccessoryCategory } from '@/types/accessory.types'
import { getMonsterAccessoryPositions, percentageToPixels } from '@/config/monster-accessory-positions.config'

/**
 * Get the color for an accessory based on its ID
 *
 * Uses the accessory ID pattern to determine the appropriate color.
 * Colors are adapted to match the cozy autumn/pastel Animal Crossing theme.
 *
 * @param accessoryId - The unique identifier of the accessory
 * @returns Hex color code for the accessory
 */
export function getAccessoryColor (accessoryId: string): string {
  // Hats - Soft pastels and autumn tones
  if (accessoryId.includes('crown')) return '#ffd9b5' // Monster Orange (soft gold)
  if (accessoryId.includes('cowboy')) return '#c97a5f' // Autumn Cinnamon
  if (accessoryId.includes('cap')) return '#b5d9ff' // Monster Blue (soft)
  if (accessoryId.includes('wizard')) return '#d9b5ff' // Monster Purple (soft)
  if (accessoryId.includes('party')) return '#ffb5d9' // Monster Pink
  if (accessoryId.includes('beret')) return '#ff8585' // Maple Warm

  // Glasses - Cute pastels
  if (accessoryId.includes('sun')) return '#6b5643' // Chestnut Deep (soft black)
  if (accessoryId.includes('nerd')) return '#c97a5f' // Autumn Cinnamon
  if (accessoryId.includes('heart')) return '#ffd9e8' // Pastel Rose
  if (accessoryId.includes('monocle')) return '#fff9b5' // Monster Yellow
  if (accessoryId.includes('3d')) return '#d9ebff' // Pastel Sky

  // Shoes - Cozy and playful
  if (accessoryId.includes('sneakers')) return '#ffa5a5' // Maple Soft
  if (accessoryId.includes('boots')) return '#b39b7f' // Chestnut Medium
  if (accessoryId.includes('ballet')) return '#ffd9e8' // Pastel Rose
  if (accessoryId.includes('roller')) return '#d9b5ff' // Monster Purple
  if (accessoryId.includes('heels')) return '#ff8585' // Maple Warm
  if (accessoryId.includes('flip-flops')) return '#ffd9b5' // Monster Orange

  return '#6b5643' // Chestnut Deep (default soft dark)
}

/**
 * Draw a hat accessory on the canvas
 *
 * @param ctx - Canvas 2D rendering context
 * @param accessoryId - ID of the hat to draw
 * @param x - X coordinate (center of monster)
 * @param y - Y coordinate (top of monster's head)
 * @param pixelSize - Size of each pixel block
 * @param frame - Animation frame number
 */
function drawHat (
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  x: number,
  y: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = getAccessoryColor(accessoryId)

  if (accessoryId.includes('crown')) {
    // Crown - Royal, imposing and majestic
    // Base - large and substantial
    ctx.fillRect(x - 24, y - 12, pixelSize * 8, pixelSize * 2) // Wide base

    // Five prominent peaks (left to right)
    // Peak 1 (far left)
    ctx.fillRect(x - 24, y - 18, pixelSize * 1.5, pixelSize * 2)
    ctx.fillRect(x - 24, y - 24, pixelSize, pixelSize * 2)

    // Peak 2 (left)
    ctx.fillRect(x - 15, y - 21, pixelSize * 1.5, pixelSize * 3)
    ctx.fillRect(x - 15, y - 27, pixelSize, pixelSize * 2)

    // Peak 3 (center - tallest)
    ctx.fillRect(x - 6, y - 24, pixelSize * 2, pixelSize * 4)
    ctx.fillRect(x - 6, y - 33, pixelSize * 1.5, pixelSize * 3)
    ctx.fillRect(x - 3, y - 36, pixelSize, pixelSize * 2)

    // Peak 4 (right)
    ctx.fillRect(x + 6, y - 21, pixelSize * 1.5, pixelSize * 3)
    ctx.fillRect(x + 9, y - 27, pixelSize, pixelSize * 2)

    // Peak 5 (far right)
    ctx.fillRect(x + 15, y - 18, pixelSize * 1.5, pixelSize * 2)
    ctx.fillRect(x + 18, y - 24, pixelSize, pixelSize * 2)

    // Precious gems - soft pastel colors
    ctx.fillStyle = '#fff9b5' // Monster Yellow (soft gold)
    ctx.fillRect(x - 3, y - 39, pixelSize, pixelSize) // Center top gem

    ctx.fillStyle = '#ffd9e8' // Pastel Rose
    ctx.fillRect(x - 15, y - 30, pixelSize, pixelSize) // Left gem
    ctx.fillRect(x + 9, y - 30, pixelSize, pixelSize) // Right gem

    ctx.fillStyle = '#d9ebff' // Pastel Sky
    ctx.fillRect(x - 24, y - 27, pixelSize, pixelSize) // Far left gem
    ctx.fillRect(x + 18, y - 27, pixelSize, pixelSize) // Far right gem

    // Subtle shine/highlight
    ctx.fillStyle = '#ffffff80' // Semi-transparent white
    ctx.fillRect(x - 21, y - 9, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x + 12, y - 9, pixelSize / 2, pixelSize / 2)
  } else if (accessoryId.includes('cowboy')) {
    // Cowboy hat - Wide brim, authentic Western style
    // Extra wide brim
    ctx.fillRect(x - 27, y - 9, pixelSize * 9, pixelSize * 2) // Wider brim
    ctx.fillRect(x - 30, y - 6, pixelSize * 10, pixelSize) // Brim edge

    // Crown of the hat
    ctx.fillRect(x - 15, y - 15, pixelSize * 5, pixelSize * 2)
    ctx.fillRect(x - 12, y - 21, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x - 9, y - 27, pixelSize * 3, pixelSize * 2)

    // Top crease/dent (classic cowboy style)
    ctx.fillRect(x - 6, y - 30, pixelSize * 2, pixelSize)

    // Decorative band with pastel accent
    ctx.fillStyle = '#e89b7f' // Autumn Terracotta
    ctx.fillRect(x - 15, y - 15, pixelSize * 5, pixelSize)

    // Subtle highlights
    ctx.fillStyle = '#ffffff60' // Semi-transparent white
    ctx.fillRect(x - 24, y - 6, pixelSize, pixelSize / 2)
    ctx.fillRect(x + 18, y - 6, pixelSize, pixelSize / 2)
  } else if (accessoryId.includes('cap')) {
    // Baseball cap - Sporty and detailed
    // Main cap body
    ctx.fillRect(x - 18, y - 12, pixelSize * 6, pixelSize * 3)
    ctx.fillRect(x - 15, y - 18, pixelSize * 5, pixelSize * 2)
    ctx.fillRect(x - 12, y - 21, pixelSize * 4, pixelSize)

    // Visor/bill
    ctx.fillRect(x - 24, y - 6, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x - 27, y - 3, pixelSize * 3, pixelSize)

    // Button on top
    ctx.fillStyle = '#ffffff80' // Light button
    ctx.fillRect(x - 3, y - 24, pixelSize, pixelSize)

    // Panel lines (classic 6-panel cap design)
    ctx.fillStyle = '#00000020' // Subtle lines
    ctx.fillRect(x - 9, y - 15, pixelSize / 2, pixelSize * 2)
    ctx.fillRect(x + 3, y - 15, pixelSize / 2, pixelSize * 2)
  } else if (accessoryId.includes('wizard')) {
    // Wizard/top hat - Tall, majestic and magical
    // Wide brim
    ctx.fillRect(x - 18, y - 15, pixelSize * 6, pixelSize * 2)

    // Hat body - tall cylinder
    ctx.fillRect(x - 12, y - 21, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x - 12, y - 27, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x - 12, y - 33, pixelSize * 4, pixelSize * 2)

    // Slightly narrower top
    ctx.fillRect(x - 9, y - 39, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x - 6, y - 42, pixelSize * 2, pixelSize)

    // Decorative band
    ctx.fillStyle = '#fff9b5' // Monster Yellow
    ctx.fillRect(x - 12, y - 21, pixelSize * 4, pixelSize)

    // Magical stars - soft pastels
    ctx.fillStyle = '#ffd9e8' // Pastel Rose
    ctx.fillRect(x - 15, y - 24, pixelSize, pixelSize)
    ctx.fillStyle = '#d9ebff' // Pastel Sky
    ctx.fillRect(x + 9, y - 30, pixelSize, pixelSize)
    ctx.fillStyle = '#fff9b5' // Monster Yellow
    ctx.fillRect(x - 3, y - 36, pixelSize, pixelSize)

    // Sparkle effect
    ctx.fillStyle = '#ffffff90'
    ctx.fillRect(x, y - 27, pixelSize / 2, pixelSize / 2)
  } else if (accessoryId.includes('party')) {
    // Party hat - Fun, festive cone
    // Base
    ctx.fillRect(x - 15, y - 15, pixelSize * 5, pixelSize * 2)

    // Cone layers - getting narrower
    ctx.fillRect(x - 12, y - 21, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x - 9, y - 27, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x - 6, y - 33, pixelSize * 2, pixelSize * 2)
    ctx.fillRect(x - 3, y - 36, pixelSize, pixelSize)

    // Colorful stripes
    ctx.fillStyle = '#ffd9e8' // Pastel Rose
    ctx.fillRect(x - 9, y - 24, pixelSize * 3, pixelSize)
    ctx.fillStyle = '#d9ebff' // Pastel Sky
    ctx.fillRect(x - 6, y - 30, pixelSize * 2, pixelSize)

    // Big fluffy pom-pom
    ctx.fillStyle = '#fff9b5' // Monster Yellow
    ctx.fillRect(x - 6, y - 39, pixelSize * 2, pixelSize)
    ctx.fillRect(x - 3, y - 42, pixelSize, pixelSize)
    ctx.fillRect(x - 9, y - 39, pixelSize, pixelSize)
    ctx.fillRect(x + 3, y - 39, pixelSize, pixelSize)

    // Confetti dots
    ctx.fillStyle = '#ffd9e8'
    ctx.fillRect(x - 6, y - 18, pixelSize / 2, pixelSize / 2)
    ctx.fillStyle = '#d9ebff'
    ctx.fillRect(x + 3, y - 21, pixelSize / 2, pixelSize / 2)
  } else if (accessoryId.includes('beret')) {
    // Beret - Artistic, French style with volume
    // Main body - fuller shape
    ctx.fillRect(x - 18, y - 12, pixelSize * 6, pixelSize * 2)
    ctx.fillRect(x - 15, y - 15, pixelSize * 5, pixelSize)
    ctx.fillRect(x - 12, y - 18, pixelSize * 4, pixelSize)

    // Top puff
    ctx.fillRect(x - 9, y - 21, pixelSize * 3, pixelSize)

    // Characteristic top button/stem
    ctx.fillStyle = '#ffffff80'
    ctx.fillRect(x - 3, y - 24, pixelSize, pixelSize)

    // Subtle tilt (right side slightly lower)
    ctx.fillStyle = getAccessoryColor(accessoryId)
    ctx.fillRect(x + 12, y - 9, pixelSize, pixelSize)

    // Shadow for depth
    ctx.fillStyle = '#00000020'
    ctx.fillRect(x - 15, y - 12, pixelSize * 5, pixelSize / 2)
  }
}

/**
 * Draw glasses accessory on the canvas
 *
 * @param ctx - Canvas 2D rendering context
 * @param accessoryId - ID of the glasses to draw
 * @param x - X coordinate (center of monster's face)
 * @param y - Y coordinate (eye level)
 * @param pixelSize - Size of each pixel block
 * @param frame - Animation frame number
 */
function drawGlasses (
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  x: number,
  y: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = getAccessoryColor(accessoryId)

  if (accessoryId.includes('sun')) {
    // Sunglasses - Cool and opaque
    ctx.fillRect(x - 24, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x + 6, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x - 15, y, pixelSize * 3, pixelSize)
  } else if (accessoryId.includes('nerd')) {
    // Nerd/round glasses
    ctx.strokeStyle = getAccessoryColor(accessoryId)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x - 18, y, 8, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + 12, y, 8, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillRect(x - 10, y, pixelSize * 2, 2)
  } else if (accessoryId.includes('heart')) {
    // Heart-shaped glasses
    ctx.fillStyle = '#FF6B9D'
    ctx.fillRect(x - 24, y, pixelSize, pixelSize)
    ctx.fillRect(x - 21, y - 3, pixelSize, pixelSize)
    ctx.fillRect(x - 18, y, pixelSize, pixelSize)
    ctx.fillRect(x - 21, y + 3, pixelSize, pixelSize)
    ctx.fillRect(x + 6, y, pixelSize, pixelSize)
    ctx.fillRect(x + 9, y - 3, pixelSize, pixelSize)
    ctx.fillRect(x + 12, y, pixelSize, pixelSize)
    ctx.fillRect(x + 9, y + 3, pixelSize, pixelSize)
  } else if (accessoryId.includes('monocle')) {
    // Monocle - Single lens on right side
    ctx.strokeStyle = getAccessoryColor(accessoryId)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x + 12, y, 10, 0, Math.PI * 2)
    ctx.stroke()
    // Chain
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(x + 20, y + 8 + i * 4, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (accessoryId.includes('3d')) {
    // 3D glasses - Red and cyan
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(x - 24, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillStyle = '#00FFFF'
    ctx.fillRect(x + 6, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillStyle = '#2C2C2C'
    ctx.fillRect(x - 15, y, pixelSize * 3, pixelSize)
  }
}

/**
 * Draw shoes accessory on the canvas
 *
 * @param ctx - Canvas 2D rendering context
 * @param accessoryId - ID of the shoes to draw
 * @param x - X coordinate (center of monster)
 * @param y - Y coordinate (bottom of monster's feet)
 * @param pixelSize - Size of each pixel block
 * @param frame - Animation frame number
 */
function drawShoes (
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  x: number,
  y: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = getAccessoryColor(accessoryId)

  if (accessoryId.includes('sneakers')) {
    // Sneakers - Athletic shoes with detailed design
    // Left shoe
    ctx.fillRect(x - 33, y, pixelSize * 5, pixelSize * 3) // Main body
    ctx.fillRect(x - 30, y - 3, pixelSize * 4, pixelSize) // Top
    ctx.fillRect(x - 36, y + 3, pixelSize * 2, pixelSize) // Toe extension

    // Right shoe
    ctx.fillRect(x + 15, y, pixelSize * 5, pixelSize * 3) // Main body
    ctx.fillRect(x + 18, y - 3, pixelSize * 4, pixelSize) // Top
    ctx.fillRect(x + 27, y + 3, pixelSize * 2, pixelSize) // Toe extension

    // White swoosh/stripes
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x - 30, y + 3, pixelSize * 3, pixelSize)
    ctx.fillRect(x - 27, y, pixelSize, pixelSize)
    ctx.fillRect(x + 18, y + 3, pixelSize * 3, pixelSize)
    ctx.fillRect(x + 21, y, pixelSize, pixelSize)

    // Laces details
    ctx.fillStyle = '#ffffff90'
    ctx.fillRect(x - 30, y - 3, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x - 27, y - 3, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x + 18, y - 3, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x + 21, y - 3, pixelSize / 2, pixelSize / 2)

    // Sole accent
    ctx.fillStyle = '#00000030'
    ctx.fillRect(x - 33, y + 6, pixelSize * 5, pixelSize / 2)
    ctx.fillRect(x + 15, y + 6, pixelSize * 5, pixelSize / 2)
  } else if (accessoryId.includes('boots')) {
    // Boots - Tall, sturdy and detailed
    // Left boot
    ctx.fillRect(x - 33, y - 6, pixelSize * 5, pixelSize * 7) // Main shaft
    ctx.fillRect(x - 36, y + 3, pixelSize * 2, pixelSize * 2) // Toe
    ctx.fillRect(x - 30, y + 6, pixelSize * 4, pixelSize) // Sole

    // Right boot
    ctx.fillRect(x + 15, y - 6, pixelSize * 5, pixelSize * 7) // Main shaft
    ctx.fillRect(x + 27, y + 3, pixelSize * 2, pixelSize * 2) // Toe
    ctx.fillRect(x + 18, y + 6, pixelSize * 4, pixelSize) // Sole

    // Buckle/strap detail
    ctx.fillStyle = '#fff9b5' // Monster Yellow
    ctx.fillRect(x - 30, y, pixelSize * 3, pixelSize)
    ctx.fillRect(x + 18, y, pixelSize * 3, pixelSize)

    // Heel
    ctx.fillStyle = getAccessoryColor(accessoryId)
    ctx.fillRect(x - 27, y + 7, pixelSize, pixelSize * 2)
    ctx.fillRect(x + 21, y + 7, pixelSize, pixelSize * 2)

    // Texture lines
    ctx.fillStyle = '#00000020'
    ctx.fillRect(x - 30, y - 3, pixelSize * 3, pixelSize / 2)
    ctx.fillRect(x + 18, y - 3, pixelSize * 3, pixelSize / 2)
  } else if (accessoryId.includes('ballet')) {
    // Ballet slippers - Delicate and graceful
    // Left slipper
    ctx.fillRect(x - 33, y, pixelSize * 5, pixelSize * 2)
    ctx.fillRect(x - 36, y + 3, pixelSize * 2, pixelSize)
    ctx.fillRect(x - 30, y - 3, pixelSize * 3, pixelSize)

    // Right slipper
    ctx.fillRect(x + 15, y, pixelSize * 5, pixelSize * 2)
    ctx.fillRect(x + 27, y + 3, pixelSize * 2, pixelSize)
    ctx.fillRect(x + 18, y - 3, pixelSize * 3, pixelSize)

    // Ribbon ties going up
    ctx.fillStyle = '#ffd9e8' // Pastel Rose (lighter)
    ctx.fillRect(x - 27, y - 6, pixelSize / 2, pixelSize * 3)
    ctx.fillRect(x - 30, y - 9, pixelSize, pixelSize / 2) // Bow left
    ctx.fillRect(x - 24, y - 9, pixelSize, pixelSize / 2) // Bow right

    ctx.fillRect(x + 21, y - 6, pixelSize / 2, pixelSize * 3)
    ctx.fillRect(x + 18, y - 9, pixelSize, pixelSize / 2) // Bow left
    ctx.fillRect(x + 24, y - 9, pixelSize, pixelSize / 2) // Bow right

    // Toe highlight
    ctx.fillStyle = '#ffffff60'
    ctx.fillRect(x - 33, y + 3, pixelSize, pixelSize / 2)
    ctx.fillRect(x + 15, y + 3, pixelSize, pixelSize / 2)
  } else if (accessoryId.includes('roller')) {
    // Roller skates - Fun and animated with wheels
    // Left skate boot
    ctx.fillRect(x - 33, y - 6, pixelSize * 5, pixelSize * 5)
    ctx.fillRect(x - 36, y + 3, pixelSize * 2, pixelSize * 2)

    // Right skate boot
    ctx.fillRect(x + 15, y - 6, pixelSize * 5, pixelSize * 5)
    ctx.fillRect(x + 27, y + 3, pixelSize * 2, pixelSize * 2)

    // Laces detail
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x - 30, y - 3, pixelSize * 2, pixelSize / 2)
    ctx.fillRect(x + 18, y - 3, pixelSize * 2, pixelSize / 2)

    // Wheels with animation
    ctx.fillStyle = '#fff9b5' // Monster Yellow
    const wheelOffset = Math.abs(Math.sin(frame * 0.15)) * 3

    // Left wheels (4 wheels)
    ctx.fillRect(x - 33, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)
    ctx.fillRect(x - 27, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)
    ctx.fillRect(x - 21, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)
    ctx.fillRect(x - 15, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)

    // Right wheels (4 wheels)
    ctx.fillRect(x + 15, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)
    ctx.fillRect(x + 21, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)
    ctx.fillRect(x + 27, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)
    ctx.fillRect(x + 33, y + 6 + wheelOffset, pixelSize * 1.5, pixelSize * 1.5)

    // Wheel centers (darker)
    ctx.fillStyle = '#d9b5ff' // Monster Purple (darker for contrast)
    ctx.fillRect(x - 30, y + 9 + wheelOffset, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x - 24, y + 9 + wheelOffset, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x - 18, y + 9 + wheelOffset, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x + 18, y + 9 + wheelOffset, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x + 24, y + 9 + wheelOffset, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x + 30, y + 9 + wheelOffset, pixelSize / 2, pixelSize / 2)
  } else if (accessoryId.includes('heels')) {
    // High heels - Elegant and sophisticated
    // Left heel
    ctx.fillRect(x - 33, y - 6, pixelSize * 4, pixelSize * 4) // Foot part
    ctx.fillRect(x - 36, y + 3, pixelSize * 2, pixelSize) // Toe
    ctx.fillRect(x - 24, y + 3, pixelSize * 1.5, pixelSize * 5) // Heel stiletto
    ctx.fillRect(x - 27, y + 7, pixelSize, pixelSize) // Heel base

    // Right heel
    ctx.fillRect(x + 15, y - 6, pixelSize * 4, pixelSize * 4) // Foot part
    ctx.fillRect(x + 27, y + 3, pixelSize * 2, pixelSize) // Toe
    ctx.fillRect(x + 21, y + 3, pixelSize * 1.5, pixelSize * 5) // Heel stiletto
    ctx.fillRect(x + 24, y + 7, pixelSize, pixelSize) // Heel base

    // Strap detail
    ctx.fillStyle = '#ffd9e8' // Pastel Rose accent
    ctx.fillRect(x - 30, y - 3, pixelSize * 3, pixelSize)
    ctx.fillRect(x + 18, y - 3, pixelSize * 3, pixelSize)

    // Shine/gloss
    ctx.fillStyle = '#ffffff70'
    ctx.fillRect(x - 30, y - 6, pixelSize, pixelSize)
    ctx.fillRect(x + 18, y - 6, pixelSize, pixelSize)
  } else if (accessoryId.includes('flip-flops')) {
    // Flip-flops - Casual and summery
    // Left flip-flop
    ctx.fillRect(x - 36, y, pixelSize * 6, pixelSize * 2) // Sole
    ctx.fillRect(x - 33, y + 3, pixelSize * 5, pixelSize) // Thicker part

    // Right flip-flop
    ctx.fillRect(x + 15, y, pixelSize * 6, pixelSize * 2) // Sole
    ctx.fillRect(x + 18, y + 3, pixelSize * 5, pixelSize) // Thicker part

    // Thong straps
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x - 27, y - 3, pixelSize, pixelSize * 3) // Center strap
    ctx.fillRect(x - 30, y, pixelSize, pixelSize) // Left strap
    ctx.fillRect(x - 24, y, pixelSize, pixelSize) // Right strap

    ctx.fillRect(x + 21, y - 3, pixelSize, pixelSize * 3) // Center strap
    ctx.fillRect(x + 18, y, pixelSize, pixelSize) // Left strap
    ctx.fillRect(x + 24, y, pixelSize, pixelSize) // Right strap

    // Decorative flower/pattern
    ctx.fillStyle = '#ffd9e8' // Pastel Rose
    ctx.fillRect(x - 27, y + 3, pixelSize, pixelSize)
    ctx.fillRect(x + 21, y + 3, pixelSize, pixelSize)

    // Texture on sole
    ctx.fillStyle = '#00000020'
    ctx.fillRect(x - 33, y + 3, pixelSize * 3, pixelSize / 2)
    ctx.fillRect(x + 18, y + 3, pixelSize * 3, pixelSize / 2)
  }
}

/**
 * Main function to draw any accessory on the canvas
 *
 * Routes to the appropriate specialized drawing function based on category.
 * This is the primary interface for rendering accessories.
 *
 * @param ctx - Canvas 2D rendering context
 * @param accessoryId - Unique identifier of the accessory
 * @param category - Category of the accessory (hat, glasses, shoes)
 * @param x - X coordinate (center reference point)
 * @param y - Y coordinate (vertical reference point based on category)
 * @param pixelSize - Size of each pixel block (usually 6)
 * @param frame - Current animation frame number
 *
 * @example
 * ```typescript
 * const ctx = canvas.getContext('2d')
 * drawAccessory(ctx, 'hat-crown', 'hat', 80, 40, 6, 0)
 * ```
 */
export function drawAccessory (
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  category: AccessoryCategory,
  x: number,
  y: number,
  pixelSize: number,
  frame: number
): void {
  switch (category) {
    case 'hat':
      drawHat(ctx, accessoryId, x, y, pixelSize, frame)
      break
    case 'glasses':
      drawGlasses(ctx, accessoryId, x, y, pixelSize, frame)
      break
    case 'shoes':
      drawShoes(ctx, accessoryId, x, y, pixelSize, frame)
      break
  }
}

/**
 * Draw an accessory centered on the canvas (for previews)
 *
 * Used primarily in the shop and accessory selection UI.
 * Centers the accessory on the canvas regardless of its actual size.
 *
 * @param ctx - Canvas 2D rendering context
 * @param accessoryId - Unique identifier of the accessory
 * @param category - Category of the accessory
 * @param canvasWidth - Width of the canvas
 * @param canvasHeight - Height of the canvas
 * @param pixelSize - Size of each pixel block
 * @param frame - Current animation frame number
 */
export function drawAccessoryCentered (
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  category: AccessoryCategory,
  canvasWidth: number,
  canvasHeight: number,
  pixelSize: number,
  frame: number
): void {
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2

  drawAccessory(ctx, accessoryId, category, centerX, centerY, pixelSize, frame)
}

/**
 * Calculate animation transform based on frame and animation config
 *
 * @param animation - Animation configuration
 * @param frame - Current frame number
 * @returns Transform object with rotation, translate, scale
 */
function getAnimationTransform (
  animation: { type: string, duration: number, params: Record<string, number> },
  frame: number
): { rotation: number, translateX: number, translateY: number, scaleMultiplier: number } {
  // Convert frame to time (assuming 60fps)
  const time = frame / 60
  const normalizedTime = (time % animation.duration) / animation.duration
  
  // Easing function for smooth animation (sine wave)
  const eased = Math.sin(normalizedTime * Math.PI * 2)
  
  const transform = {
    rotation: 0,
    translateX: 0,
    translateY: 0,
    scaleMultiplier: 1
  }
  
  switch (animation.type) {
    case 'sway':
      // Rotation animation
      transform.rotation = eased * (animation.params.rotationRange ?? 0)
      break
    case 'float':
    case 'bounce':
      // Vertical translation animation
      transform.translateY = eased * (animation.params.translateY ?? 0)
      break
    case 'breathe': {
      // Scale animation
      const scaleRange = animation.params.scaleRange ?? 0
      transform.scaleMultiplier = 1 + (eased * scaleRange)
      break
    }
  }
  
  return transform
}

/**
 * Draw all equipped accessories on a monster
 *
 * Uses configured positions based on monster type for accurate placement.
 * Draws in order: shoes -> glasses -> hat (bottom to top) for proper layering.
 * Applies animation transforms to synchronize with monster animations.
 *
 * @param ctx - Canvas 2D rendering context
 * @param accessories - Map of equipped accessories by category
 * @param canvasSize - Size of the canvas (width and height, assumed square)
 * @param monsterAssetPath - Path to the monster SVG for position lookup
 * @param pixelSize - Size of each pixel block
 * @param frame - Current animation frame number
 */
export function drawEquippedAccessories (
  ctx: CanvasRenderingContext2D,
  accessories: {
    hat?: string
    glasses?: string
    shoes?: string
  },
  canvasSize: number,
  monsterAssetPath: string,
  pixelSize: number,
  frame: number
): void {
  // Get configured positions for this monster type
  const positions = getMonsterAccessoryPositions(monsterAssetPath)
  
  // Calculate animation transform
  const animTransform = getAnimationTransform(positions.animation, frame)

  // Draw in order: shoes -> glasses -> hat (bottom to top)
  // This ensures proper layering

  if (accessories.shoes != null) {
    const shoesX = percentageToPixels(positions.shoes.x, canvasSize)
    const shoesY = percentageToPixels(positions.shoes.y, canvasSize)
    const scale = positions.shoes.scale ?? 1.0
    
    ctx.save()
    ctx.translate(shoesX, shoesY)
    // Apply animation transforms
    ctx.rotate(animTransform.rotation * Math.PI / 180)
    ctx.translate(animTransform.translateX, animTransform.translateY)
    ctx.scale(scale * animTransform.scaleMultiplier, scale * animTransform.scaleMultiplier)
    ctx.translate(-shoesX, -shoesY)
    drawAccessory(ctx, accessories.shoes, 'shoes', shoesX, shoesY, pixelSize, frame)
    ctx.restore()
  }

  if (accessories.glasses != null) {
    const glassesX = percentageToPixels(positions.glasses.x, canvasSize)
    const glassesY = percentageToPixels(positions.glasses.y, canvasSize)
    const scale = positions.glasses.scale ?? 1.0
    
    ctx.save()
    ctx.translate(glassesX, glassesY)
    // Apply animation transforms
    ctx.rotate(animTransform.rotation * Math.PI / 180)
    ctx.translate(animTransform.translateX, animTransform.translateY)
    ctx.scale(scale * animTransform.scaleMultiplier, scale * animTransform.scaleMultiplier)
    ctx.translate(-glassesX, -glassesY)
    drawAccessory(ctx, accessories.glasses, 'glasses', glassesX, glassesY, pixelSize, frame)
    ctx.restore()
  }

  if (accessories.hat != null) {
    const hatX = percentageToPixels(positions.hat.x, canvasSize)
    const hatY = percentageToPixels(positions.hat.y, canvasSize)
    const scale = positions.hat.scale ?? 1.0
    
    ctx.save()
    ctx.translate(hatX, hatY)
    // Apply animation transforms
    ctx.rotate(animTransform.rotation * Math.PI / 180)
    ctx.translate(animTransform.translateX, animTransform.translateY)
    ctx.scale(scale * animTransform.scaleMultiplier, scale * animTransform.scaleMultiplier)
    ctx.translate(-hatX, -hatY)
    drawAccessory(ctx, accessories.hat, 'hat', hatX, hatY, pixelSize, frame)
    ctx.restore()
  }
}
