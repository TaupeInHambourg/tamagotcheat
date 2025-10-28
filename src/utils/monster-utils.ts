import { MonsterTemplate, monsterTemplates } from '@/types/monster-templates.types'

function hexToRgb (hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result == null) return null

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

function colorDistance (color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (rgb1 == null || rgb2 == null) return Infinity

  return Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  )
}

export function findMonsterTemplateByColor (color: string): MonsterTemplate {
  const availableTemplates = Object.values(monsterTemplates)
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
