/**
 * Monster Accessory Positions Configuration
 *
 * Defines where accessories should be placed on each monster type.
 * Positions are in percentage of the SVG viewBox (0-100).
 *
 * Architecture:
 * - Configuration layer (Clean Architecture)
 * - Single Responsibility: Define accessory anchor points
 * - Open/Closed: Easy to add new monsters without modifying code
 *
 * Analysis based on SVG viewBox="0 0 32 32":
 * - All positions are calculated relative to the 32x32 grid
 * - Converted to percentages for scalability
 */

export interface AccessoryPosition {
  /** X position as percentage (0-100) */
  x: number
  /** Y position as percentage (0-100) */
  y: number
  /** Optional scale adjustment for this position (default: 1) */
  scale?: number
}

export interface MonsterAnimation {
  /** Type of animation */
  type: 'sway' | 'float' | 'breathe' | 'bounce'
  /** Animation duration in seconds */
  duration: number
  /** Animation parameters (rotation, translation, scale) */
  params: {
    rotationRange?: number // For sway (in degrees)
    translateY?: number // For float/bounce (in pixels)
    scaleRange?: number // For breathe (scale multiplier)
  }
}

export interface MonsterAccessoryPositions {
  /** Hat position (top of head) */
  hat: AccessoryPosition
  /** Glasses position (over eyes) */
  glasses: AccessoryPosition
  /** Shoes position (on feet) */
  shoes: AccessoryPosition
  /** Animation configuration */
  animation: MonsterAnimation
}

/**
 * Accessory positions for each monster type
 *
 * Positions are calculated from SVG analysis:
 * - Hat: Top of head (around y=6-10)
 * - Glasses: Eye level (around y=13-15)
 * - Shoes: Feet level (around y=24-27)
 */
export const MONSTER_ACCESSORY_POSITIONS: Record<string, MonsterAccessoryPositions> = {
  /**
   * Chat Cosmique (Cosmic Cat)
   *
   * Analysis:
   * - Head: y=10-20, centered at x=16
   * - Ears: y=6-10 (top of head)
   * - Eyes: y=13-16, x=12-20, 3x3 pixels each, 8 pixels total width
   * - Body: y=20-24
   * - Feet: y=24-28, 3-4 pixels width each
   */
  'chat-cosmique': {
    hat: {
      x: 50, // Center (16/32 = 50%)
      y: 25, // On top of ears (8/32 = 25%)
      scale: 1.0 // Normal size
    },
    glasses: {
      x: 50, // Center (16/32 = 50%)
      y: 43.75, // Eye level (14/32 = 43.75%)
      scale: 1.0 // Normal size
    },
    shoes: {
      x: 50, // Center (16/32 = 50%)
      y: 84.375, // Feet level (27/32 = 84.375%)
      scale: 1.0 // Normal size
    },
    animation: {
      type: 'sway',
      duration: 3,
      params: {
        rotationRange: 2 // -2° to +2°
      }
    }
  },

  /**
   * Dino Nuage (Cloud Dino)
   *
   * Analysis:
   * - Body: y=11-21, wider shape
   * - Head: y=12-18, x=20-26 (right side)
   * - Spikes on back: y=8-11
   * - Eyes: y=14-17, x=22-25, single eye 3x3 pixels
   * - Feet: y=21-25, 3-4 pixels width each
   */
  'dino-nuage': {
    hat: {
      x: 56.25, // Head center (18/32 = 56.25%)
      y: 28.125, // On top of spikes (9/32 = 28.125%)
      scale: 1.0
    },
    glasses: {
      x: 71.875, // Eye position (23/32 = 71.875%)
      y: 46.875, // Eye level (15/32 = 46.875%)
      scale: 0.7 // Smaller for single eye
    },
    shoes: {
      x: 50, // Center between feet (16/32 = 50%)
      y: 78.125, // Feet level (25/32 = 78.125%)
      scale: 1.0 // Normal size
    },
    animation: {
      type: 'float',
      duration: 3,
      params: {
        translateY: -4 // Float up 4px
      }
    }
  },

  /**
   * Fairy Monster
   *
   * Analysis:
   * - Antennae: y=4-9 (very top)
   * - Ears: y=10-15
   * - Body: y=9-24
   * - Eyes: y=11-15, x=11-20, 3x4 pixels each, 10 pixels total width
   * - Feet: y=24-28, 4-5 pixels width each
   */
  'fairy-monster': {
    hat: {
      x: 50, // Center (16/32 = 50%)
      y: 18.75, // On top of antennae (6/32 = 18.75%)
      scale: 1.0
    },
    glasses: {
      x: 50, // Center (16/32 = 50%)
      y: 40.625, // Eye level (13/32 = 40.625%)
      scale: 1.0 // Normal size
    },
    shoes: {
      x: 50, // Center
      y: 84.375, // Feet level (27/32 = 84.375%)
      scale: 1.0 // Normal size
    },
    animation: {
      type: 'bounce',
      duration: 2,
      params: {
        translateY: -2 // Bounce up 2px
      }
    }
  },

  /**
   * Grenouille Étoilée (Starry Frog)
   *
   * Analysis:
   * - Crown on top: y=6-9
   * - Eyes: Large protruding eyes y=10-14, 3x3 pixels + base 5x2, 11 pixels total width
   * - Body: y=15-22
   * - Feet: y=22-28, large feet 5 pixels width each
   */
  'grenouille-etoilee': {
    hat: {
      x: 50, // Center
      y: 25, // On top of crown (8/32 = 25%)
      scale: 1.0
    },
    glasses: {
      x: 50, // Center
      y: 37.5, // Eye level (12/32 = 37.5%)
      scale: 1.0 // Normal size
    },
    shoes: {
      x: 50, // Center
      y: 84.375, // Feet level (27/32 = 84.375%)
      scale: 1.0 // Normal size
    },
    animation: {
      type: 'breathe',
      duration: 2,
      params: {
        scaleRange: 0.05 // Scale from 1.0 to 1.05
      }
    }
  }
}

/**
 * Get accessory positions for a specific monster
 *
 * Extracts the monster folder name from the asset path and returns
 * the corresponding accessory positions.
 *
 * @param monsterAssetPath - Path to monster SVG (e.g., "/assets/tamagocheats/chat-cosmique/happy.svg")
 * @returns Accessory positions for this monster, or default positions if not found
 */
export function getMonsterAccessoryPositions (monsterAssetPath: string): MonsterAccessoryPositions {
  // Extract folder name from path (e.g., "chat-cosmique" from "/assets/tamagocheats/chat-cosmique/happy.svg")
  const pathParts = monsterAssetPath.split('/')
  const folderIndex = pathParts.indexOf('tamagocheats')
  
  if (folderIndex !== -1 && pathParts.length > folderIndex + 1) {
    const monsterType = pathParts[folderIndex + 1]
    
    if (monsterType in MONSTER_ACCESSORY_POSITIONS) {
      return MONSTER_ACCESSORY_POSITIONS[monsterType]
    }
  }

  // Default positions if monster not found (centered)
  console.warn(`No accessory positions defined for monster: ${monsterAssetPath}. Using defaults.`)
  return {
    hat: { x: 50, y: 20, scale: 1.0 },
    glasses: { x: 50, y: 45, scale: 1.0 },
    shoes: { x: 50, y: 80, scale: 1.0 },
    animation: {
      type: 'bounce',
      duration: 2,
      params: { translateY: -2 }
    }
  }
}

/**
 * Convert percentage position to pixel position
 *
 * @param percentage - Position as percentage (0-100)
 * @param totalSize - Total size in pixels (e.g., canvas width or height)
 * @returns Position in pixels
 */
export function percentageToPixels (percentage: number, totalSize: number): number {
  return (percentage / 100) * totalSize
}
