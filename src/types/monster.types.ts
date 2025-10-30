/**
 * Monster Types and Interfaces
 *
 * Defines all type definitions related to monsters in the application.
 * Includes domain models, DTOs, and template configurations.
 *
 * Following Clean Architecture principles:
 * - Domain entities (Monster)
 * - Data Transfer Objects (CreateMonsterDto)
 * - Configuration (MonsterTemplates)
 */

/**
 * Available monster states
 * Represents the emotional/physical condition of a monster
 */
export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

/**
 * Monster color type
 * Hex color codes used for monster visualization
 */
export type MonsterColor = '#FF69B4' | '#87CEEB' | '#98FB98' | '#FFD700'

/**
 * Monster state union type
 */
export type MonsterState = typeof MONSTER_STATES[number]

/**
 * Default values for monster creation
 */
export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

/**
 * Monster Domain Entity
 *
 * Represents a complete monster with all its properties.
 * This is the main domain model used throughout the application.
 */
export interface Monster {
  /** MongoDB document ID (optional for new monsters) */
  id?: string
  /** Alternative MongoDB ID format */
  _id?: string
  /** Display name of the monster */
  name: string
  /** Folder path for monster assets */
  folderPath: string
  /** Path to the monster's visual representation */
  draw: string
  /** Available color range for this monster type */
  colorRange: string[]
  /** Default color for this monster */
  defaultColor: MonsterColor
  /** Current emotional/physical state */
  state: MonsterState
  /** Current level (experience-based progression) */
  level?: number
  /** Experience points earned */
  experience?: number
  /** ID of the user who owns this monster */
  ownerId?: string
  /** Last update timestamp */
  updatedAt?: string
  /** Creation timestamp */
  createdAt?: string
  /** Timestamp when the state last changed */
  lastStateChange?: Date
  /** Timestamp when the state should change next */
  nextStateChangeAt?: Date
}

/**
 * Create Monster Data Transfer Object
 *
 * Simplified data structure for creating new monsters.
 * Contains only the essential information needed from the user.
 */
export interface CreateMonsterDto {
  /** Name chosen by the user */
  name: string
  /** Color preference (may not be directly used) */
  color: string
  /** Template ID to base the monster on */
  templateId: string
}

/**
 * Monster Template Configuration
 *
 * Defines the base configuration for each monster type.
 * Used as a blueprint when creating new monster instances.
 */
export interface MonsterTemplate {
  /** Unique identifier for this template */
  id: string
  /** Display name of the monster type */
  name: string
  /** Folder containing template assets */
  folderPath: string
  /** Default visual representation path */
  draw: string
  /** Available colors for this template */
  colorRange: string[]
  /** Default color */
  defaultColor: MonsterColor
}

/**
 * Monster Template Registry
 *
 * Central configuration of all available monster templates.
 * Each template defines a unique monster type with its characteristics.
 *
 * Templates:
 * - chat-cosmique: Pink cosmic cat
 * - dino-nuage: Blue cloud dinosaur
 * - fairy-monster: Green fairy creature
 * - grenouille-etoilee: Golden starry frog
 */
export const MonsterTemplates: Record<string, MonsterTemplate> = {
  'chat-cosmique': {
    id: 'pink',
    name: 'Chat Cosmique',
    folderPath: 'chat-cosmique',
    draw: '/assets/tamagocheats/chat-cosmique/happy.svg',
    colorRange: ['#FF69B4', '#FF1493', '#C71585'],
    defaultColor: '#FF69B4'
  },
  'dino-nuage': {
    id: 'blue',
    name: 'Dino Nuage',
    folderPath: 'dino-nuage',
    draw: '/assets/tamagocheats/dino-nuage/happy.svg',
    colorRange: ['#87CEEB', '#00BFFF', '#1E90FF'],
    defaultColor: '#87CEEB'
  },
  'fairy-monster': {
    id: 'green',
    name: 'Monstre Féérique',
    folderPath: 'fairy-monster',
    draw: '/assets/tamagocheats/fairy-monster/happy.svg',
    colorRange: ['#98FB98', '#90EE90', '#32CD32'],
    defaultColor: '#98FB98'
  },
  'grenouille-etoilee': {
    id: 'gold',
    name: 'Grenouille Étoilée',
    folderPath: 'grenouille-etoilee',
    draw: '/assets/tamagocheats/grenouille-etoilee/happy.svg',
    colorRange: ['#FFD700', '#FFA500', '#FF8C00'],
    defaultColor: '#FFD700'
  }
}
