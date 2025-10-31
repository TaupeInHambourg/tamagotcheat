import { drawAccessory } from './accessory-renderer'
import type { AccessoryCategory } from '@/types/accessory.types'

export function accessoryToDataURI (
  accessoryId: string,
  category: AccessoryCategory,
  pixelSize: number = 3
): string {
  const canvas = document.createElement('canvas')
  let width: number
  let height: number
  let centerX: number
  let centerY: number

  // Canvas sizes need to accommodate pixelSize multiplier
  // With pixelSize=3, accessories can extend ~40*3=120 pixels from center
  // So we need at least 240x240 to be safe
  switch (category) {
    case 'hat':
      width = 240
      height = 240
      centerX = 120 // Center horizontally
      centerY = 120 // Center vertically
      break
    case 'glasses':
      width = 240
      height = 120
      centerX = 120
      centerY = 60
      break
    case 'shoes':
      width = 240
      height = 160
      centerX = 120
      centerY = 80
      break
    default:
      width = 240
      height = 240
      centerX = 120
      centerY = 120
  }

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (ctx == null) return ''

  ctx.imageSmoothingEnabled = false
  drawAccessory(ctx, accessoryId, category, centerX, centerY, pixelSize, 0)

  return canvas.toDataURL('image/png')
}
