export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const
export type MonsterColor = '#FF69B4' | '#87CEEB' | '#98FB98' | '#FFD700'

export type MonsterState = typeof MONSTER_STATES[number]

export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

export interface Monster {
  _id?: string
  name: string
  folderPath: string
  draw: string
  colorRange: string[]
  defaultColor: MonsterColor
  state: MonsterState
  level: number
  experience: number
  ownerId?: string
  updatedAt?: string
  createdAt?: string
}

export interface CreateMonsterDto {
  name: string
  color: string
  templateId: string
}

// Templates de monstres disponibles
export interface MonsterTemplate {
  id: string
  name: string
  folderPath: string
  draw: string
  colorRange: string[]
  defaultColor: MonsterColor
}

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
